import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Checkbox, Select, TextField, Form, FileUpload } from '../../components/forms';
import { Rap, EventName } from '../../raps/types';
import './modal.scss';
import { useUpload } from '../upload';
import { AppContext } from '../../context';
import { ProgressBar } from '../../raps/components/progress-bar';

const rappers = [
  'Andrew Phang',
  'Andrew Summerton',
  'Campbell Pedersen',
  'Candice Vickers',
  'Christopher Li',
  'Dennis Nguyen',
  'Harry Bird',
  'James Summerton',
  'Leonard Dunne',
  'Lucas Sukadana',
  'Nathan Kosc',
  'Piers Sinclair',
  'Rachel Neumann',
  'Simon Warman',
  'Tristan Hessell'
];

export const UploadModal: React.FC = () => {
  const {
    upload: { progress, failedMessage },
  } = useContext(AppContext);
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<Omit<Rap, 'id'>>({
    title: '',
    rapper: '',
    bonus: false,
    imageUrl: '',
    appearedAt: { name: EventName.BSDAC, series: 13 }
  });
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const upload = useUpload();

  const submit = async () => {
    const success = await upload(file, details);
    if (success) close();
  }

  return (<>
    <button onClick={open} className='btn btn-primary' type='button'>↑ Upload</button>
    <Modal show={show} onHide={close} backdrop='static' scrollable>
      <Modal.Header>
        <Modal.Title>{progress === undefined ? 'Upload Your Rap' : 'Uploading Your Rap...'}</Modal.Title>
      </Modal.Header>
      {progress === undefined ?
        <Form onSubmit={submit}>
          <Modal.Body>
            {failedMessage && <div className="alert alert-danger" role="alert">{failedMessage}</div>}
            <FileUpload id='rap-file' label='Audio File' accept='audio/*' onChange={file => setFile(file)} required />
            <TextField id='title' label='Title' type='text' required value={details.title} onChange={title => setDetails({ ...details, title })} />
            <Select id='rapper' label='Artist' required options={rappers} value={details.rapper} onChange={rapper => setDetails({ ...details, rapper })} />
            <TextField id='image-url' label='Image URL' type='text' required value={details.imageUrl} onChange={imageUrl => setDetails({ ...details, imageUrl })}/>
            <Checkbox id='bonus' label='Bonus Track' value={details.bonus} onChange={bonus => setDetails({ ...details, bonus })}/>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-secondary' type='button' onClick={close}>Back</button>
            <button className='btn btn-primary' type='submit'>↑ Upload</button>
          </Modal.Footer>
        </Form>
        :
        <Modal.Body>
          <ProgressBar progress={progress} />
        </Modal.Body>
      }
    </Modal>
  </>)
}