import React, { Fragment, useState } from 'react';
import axios from 'axios';

import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose file');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUploadPercentage(0);
    setMessage('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round(progressEvent.loaded * 100) / progressEvent.total));
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File uploaded');
    } catch (error) {
      if (error.response.status === 500) {
        setMessage('There was a problem with the server.');
      } else {
        setMessage(error.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      { message && <Message msg={message} /> }
      <form onSubmit={onSubmit}>
        <div className="custom-file">
          <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
      </form>

      { uploadedFile && <div className="row mt-4">
        <div className="col-md-6 m-auto">
          <h3 className="text-center">{ uploadedFile.fileName }</h3>
          <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
        </div>
      </div> }
    </Fragment>
  );
}

export default FileUpload;
