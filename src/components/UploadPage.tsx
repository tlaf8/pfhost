import {Link} from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";

interface UploadProps {
    userDir: string | null;
}

const UploadPage: React.FC<UploadProps> = ({userDir}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [linkInput, setLinkInput] = useState<string>("");
    const [filenameInput, setFilenameInput] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const can_accept = (path: string) => {
        return /\.(mp3|ogg|mp4|mov|webm|avi|png|jpeg|jpg|gif)$/i.test(path);
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setLinkInput("");
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!can_accept(file.name)) {
                alert("Cannot upload files of this type\nAccepted types are: mp3, mp4, mov, webm, avi, ogg, png, jpg/jpeg, gif");
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

        setLoading(true);
        setUploadProgress(0);

        if (selectedFile) {
            const token = sessionStorage.getItem('authToken');
            if (!token || !userDir) {
                console.error('Could not load token');
                return;
            }
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                await axios.post(`https://pfhost.duckdns.org/api/upload`, formData, {
                    headers: {
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`,
                        'path': userDir,
                        'filename': ''
                    }, onUploadProgress: (progressEvent) => {
                        const percentage = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                        setUploadProgress(percentage);
                    }
                });

                alert("File uploaded successfully");
                setSelectedFile(null);
                setPreviewUrl(null);
                setUploadProgress(0);
            } catch (err) {
                console.error("Error uploading file: ", err);
                if (axios.isAxiosError(err)) {
                    console.error('Error details:', {
                        status: err.response?.status,
                        statusText: err.response?.statusText,
                        data: err.response?.data,
                        headers: err.response?.headers
                    });

                    const errorMessage = err.response?.data?.message || err.response?.data || err.message;
                    alert(`Upload failed: ${errorMessage}`);
                } else {
                    alert("Failed to upload file. Check console for details");
                }
                setUploadProgress(0);
            }
        } else if (linkInput) {
            alert("Link upload is not supported yet.");
            handleClear()
            // const result = await axios.get(`${hostname}${yoink_path}?url=${encodeURI(linkInput)}`);
            // if (result.status === 200) {
            //     alert('File downloaded successfully');
            // }
            // if (result.status === 201) {
            //     alert(`Could not download video: ${result.data}`)
            // }
        } else {
            alert("Please select a file or enter a link.");
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
                {previewUrl && (<div style={{marginTop: "15px"}}>
                    {selectedFile?.type.startsWith("video") ? (<video
                        muted
                        autoPlay
                        playsInline
                        src={previewUrl}
                        controls
                        style={{width: "10vw", height: "auto"}}
                    />) : (<img
                        src={previewUrl}
                        alt="preview"
                        style={{width: "10vw", height: "auto"}}
                    />)}
                </div>)}
            </div>or

            <div>
                <input
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
                        color: "#000"
                    }}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>

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
                        color: "#000"
                    }}
                >
                    Clear
                </button>

                <Link
                    to="/dashboard"
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
                        >{uploadProgress}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadPage;