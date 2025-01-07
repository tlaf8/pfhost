import {Link} from "react-router-dom";
import React, {useRef, useState} from "react";
import axios from "axios";

interface UploadProps {
    userDir: string | null;
}

function extension(filePath: string): string {
    const match = filePath.match(/\.([a-zA-Z0-9]+)$/);
    return match ? `.${match[1]}` : '';
}

const UploadPage: React.FC<UploadProps> = ({userDir}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [linkInput, setLinkInput] = useState<string>("");
    const [filenameInput, setFilenameInput] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<string>('0');
    const [fetchingLink, setFetchingLink] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const ctrlRef = useRef<AbortController | null>(null);

    const can_accept = (path: string) => {
        return /\.(mp3|ogg|opus|wav|aac|m4a|mp4|m4v|mov|webm|ogv|png|jpeg|jpg|gif|webp|svg|bmp|ico)$/i.test(path);
    };

    const handleClear = () => {
        if (loading) return;
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        setLinkInput("");
        setFilenameInput("");
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    const handleCancel = () => {
        if (ctrlRef.current) {
            ctrlRef.current.abort();
        } else {
            setError('No controller reference');
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!can_accept(file.name)) {
                alert("Cannot upload files of this type. Accepted types are: mp3, ogg, mp4, mov, webm, ogv, jpeg, jpg, png, gif, bmp, ico, svg, m4v, aac, opus, wav, webp");
                handleClear();
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleLinkInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinkInput(event.target.value);
    };

    const handleFilenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilenameInput(event.target.value);
    }

    const handleUpload = async () => {
        if (loading) return;

        const controller = new AbortController();
        ctrlRef.current = controller;
        setLoading(true);
        setSuccess(null);
        setError(null);
        setUploadProgress('0');

        const token = sessionStorage.getItem('authToken');
        if (!token || !userDir) {
            setError('Could not find token');
            return;
        }

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                await axios.post(`https://pfhost.duckdns.org/api/upload`, formData, {
                    signal: controller.signal,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        path: userDir,
                        filename: (filenameInput === '') ? selectedFile.name : `${filenameInput}${extension(selectedFile.name)}`,
                    }, onUploadProgress: (progressEvent) => {
                        const percentage = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                        setUploadProgress(percentage.toString());
                    }
                });

                setSuccess(`${selectedFile.name} uploaded successfully`);
                handleClear();
                setUploadProgress('0');
            } catch (err) {
                if (axios.isCancel(err)) {
                    setError('Upload cancelled');
                } else if (axios.isAxiosError(err)) {
                    if (err.status === 409) {
                        setError('File already exists. Please enter a new name');
                    } else {
                        setError(`Upload failed. Check console for details`);
                        console.error('Error details:', err);
                    }
                } else {
                    setError('Unknown error occurred. Check console for details')
                    console.error(error);
                }
                setUploadProgress('0');
            }
        } else if (linkInput) {
            try {
                setFetchingLink(true);
                const response = await axios.get('https://pfhost.duckdns.org/api/fetchurl', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        path: userDir,
                        weblink: linkInput,
                        filename: filenameInput,
                    }
                });
                handleClear();
                setFetchingLink(false);

                const {results} = response.data;
                if (response.status === 200) {
                    setSuccess('All media files downloaded successfully');
                } else {
                    setError(`Some files failed to download: ${results}`)
                }
            } catch (error) {
                setFetchingLink(false);
                if (axios.isAxiosError(error)) {
                    if (error.status === 501) {
                        setError('This site is currently not implemented yet');
                    } else {
                        setError(`Request failed: ${error.message}`);
                    }
                }
            }
        } else {
            setError("Please select a file or enter a link." + linkInput);
        }

        setLoading(false);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75vh'
        }}>
            <input
                type="file"
                onChange={handleFileChange}
                style={{
                    border: "2px solid black", borderRadius: "5px", padding: "5px", margin: "10px", cursor: "pointer"
                }}
            />

            <div style={{marginBottom: "5px"}}>
                {previewUrl && (
                    <div style={{marginTop: "15px"}}>
                        {selectedFile?.type.startsWith("video") ? (<video
                            muted
                            autoPlay
                            playsInline
                            src={previewUrl}
                            controls
                            style={{width: "auto", height: "20vh"}}
                        />) : (<img
                            src={previewUrl}
                            alt="preview"
                            style={{width: "auto", height: "20vh"}}
                        />)}
                    </div>)}
            </div>
            or
            <div>
                <input
                    id="linkIn"
                    type="text"
                    value={linkInput}
                    onChange={handleLinkInputChange}
                    placeholder="Enter a link to upload"
                    style={{
                        border: "2px solid black", borderRadius: "5px", padding: "5px", margin: "10px", width: "250px"
                    }}
                />
            </div>

            <div>
                <input
                    id='filenameIn'
                    type='text'
                    value={filenameInput}
                    onChange={handleFilenameInputChange}
                    placeholder="Enter custom file name"
                    style={{
                        border: "2px solid black", borderRadius: "5px", padding: "5px", margin: "10px", width: "200px"
                    }}
                />
            </div>

            <div
                style={{
                    display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px"
                }}
            >
                {loading ? (
                    <button
                        onClick={handleCancel}
                        style={{
                            display: "inline-block",
                            border: "2px solid black",
                            borderRadius: "5px",
                            fontSize: "12px",
                            padding: "5px 10px",
                            textDecoration: "none",
                            backgroundColor: "#fff",
                            color: "#000",
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                ) : (
                    <button
                        onClick={handleUpload}
                        style={{
                            display: "inline-block",
                            border: "2px solid black",
                            borderRadius: "5px",
                            fontSize: "12px",
                            padding: "5px 10px",
                            textDecoration: "none",
                            backgroundColor: "#fff",
                            color: "#000",
                            cursor: 'pointer',
                        }}
                    >
                        Upload
                    </button>
                )}

                <button
                    onClick={handleClear}
                    style={{
                        display: "inline-block",
                        border: "2px solid black",
                        borderRadius: "5px",
                        fontSize: "12px",
                        padding: "5px 10px",
                        textDecoration: "none",
                        backgroundColor: "#fff",
                        color: "#000",
                        cursor: 'pointer',
                    }}
                >
                    Clear
                </button>

                <Link
                    to={loading ? '#' : '/dashboard'}
                    style={{
                        display: "inline-block",
                        border: "2px solid black",
                        fontSize: "12px",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        textDecoration: "none",
                        backgroundColor: "#fff",
                        color: "#000"
                    }}
                >
                    Back
                </Link>
            </div>

            {error && (<p style={{color: 'red'}}>{error}</p>)}
            {success && (<p style={{color: 'green'}}>{success}</p>)}

            {fetchingLink && (
                <div className='spinner-container' style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '75px',
                }}>
                    <div className='dots'></div>
                </div>
            )}

            {loading && selectedFile && (<div style={{
                    marginTop: "20px", width: "300px", margin: "20px auto"
                }}>
                    <div style={{
                        width: "100%",
                        height: "20px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "2px solid #ccc"
                    }}>
                        <div
                            style={{
                                width: `${uploadProgress}%`,
                                height: "100%",
                                backgroundColor: "#4CAF50",
                                transition: "width 0.3s ease-in-out",
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white'
                            }}
                        >{(uploadProgress !== '100') ? (`${uploadProgress}%`) : ('Processing...')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadPage;
