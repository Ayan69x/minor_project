import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitDocument } from '../../redux/slice/documentRequestSlice';

const DocumentUpload = () => {
    const { id } = useParams(); // Get document request ID from URL
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate()

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Ensure a file is selected
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        console.log("Submitting document with ID: ", id);
        console.log("fileName:", fileName);

        // Dispatch the action to submit the document if the id exists
        if (id) {
            dispatch(submitDocument({ documentRequestId: id, file: selectedFile }));
        }

        console.log("File uploaded: ", selectedFile);
        alert(`File uploaded: ${fileName}`);

        // Reset file input after upload
        setSelectedFile(null);
        setFileName('');
        navigate('/requested-documents')
        
    };

    return (
        <div style={styles.container}>
            <h2>Upload Documents</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label htmlFor="fileUpload" style={styles.label}>Choose a file:</label>
                <input 
                    type="file" 
                    id="fileUpload" 
                    onChange={handleFileChange} 
                    style={styles.fileInput} 
                />
                {fileName && <p style={styles.fileName}>Selected file: {fileName}</p>}
                
                <button type="submit" style={styles.uploadButton} disabled={!selectedFile}>
                    Upload
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    label: {
        marginBottom: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    fileInput: {
        marginBottom: '10px',
    },
    fileName: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#555',
    },
    uploadButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default DocumentUpload;
