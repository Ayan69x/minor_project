import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../style/addEditEmployee.module.css'; 
import { createDocumentRequest, getAllDocumentRequests, updateDocumentRequest } from '../../redux/slice/documentRequestSlice';

const AddEditDocument = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { requests, error, loading } = useSelector((state) => state.documentRequest);

  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    employees: [],
    format: "", 
    maxSize: 0, 
    dueDate: ""
  });

  useEffect(() => {
    if (id) {
      dispatch(getAllDocumentRequests());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && requests.length > 0) {
      const editDocDetails = requests.find((doc) => doc._id === id);
      if (editDocDetails) {
        setDocumentData({
          title: editDocDetails.title || '',
          description: editDocDetails.description || '',
          employees: editDocDetails.employees.map(emp => emp._id) || [], // handle multiple employees
          format: editDocDetails.format || '',
          maxSize: editDocDetails.maxSize || 0,
          dueDate: editDocDetails.dueDate?.split('T')[0] || '',
        });
      }
    }
  }, [requests, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateDocumentRequest({ id, updateData: documentData })).unwrap();
      } else {
        await dispatch(createDocumentRequest(documentData)).unwrap();
      }
      navigate('/requested-documents');
      await dispatch(getAllDocumentRequests());
    } catch (err) {
      console.error('Failed to submit document request:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.documentFormContainer} style={{ marginTop: "6rem" }}>
      <div className={styles.documentFormCard}>
        <h2 className={styles.formTitle}>{id ? 'Edit Document Request' : 'Add Document Request'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="title" 
            placeholder="Title" 
            value={documentData.title} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={documentData.description} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="employees" 
            placeholder="Employee ID(s)" 
            value={documentData.employees.join(", ")} 
            onChange={(e) => setDocumentData({ ...documentData, employees: e.target.value.split(",").map(emp => emp.trim()) })} 
            required 
          />
          <input 
            name="format" 
            placeholder="File Format" 
            value={documentData.format} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="maxSize" 
            type="number" 
            placeholder="Max File Size (MB)" 
            value={documentData.maxSize} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="dueDate" 
            type="date" 
            placeholder="Due Date" 
            value={documentData.dueDate} 
            onChange={handleChange} 
            required 
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {id ? 'Update Document Request' : 'Add Document Request'}
          </button>
        </form>
        {error && <div className={styles.errorMessage}>{error.message || error}</div>}
      </div>
    </div>
  );
};

export default AddEditDocument;
