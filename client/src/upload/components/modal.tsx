import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Checkbox, Select, TextField, Form, FileUpload } from '../../components/forms';
import { Rap, Event, getEventLabel } from '../../api/raps/types';
import { useUpload } from '../../api/raps/upload';
import { AppContext } from '../../context';
import { ProgressBar } from '../../raps/components/progress-bar';
import { events, rappers } from '../../raps/constants';
import './modal.scss';

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
    appearedAt: events[0],
  });
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const upload = useUpload();

  const submit = async () => {
    const success = await upload(file, details);
    if (success) close();
  };

  return (<>
    <button onClick={open} className='btn btn-primary' type='button'>↑ Upload</button>
    {show &&
      <Modal
        show
        onHide={close}
        backdrop='static'
        scrollable
        autoFocus={false}
        enforceFocus={false}
        restoreFocus={false}
      >
        <div className='modal-header'>
          <h5 className='modal-title'>{progress === undefined ? 'Upload Your Rap' : 'Uploading Your Rap...'}</h5>
        </div>
        {progress === undefined ?
          <Form onSubmit={submit}>
            <div className='modal-body'>
              {failedMessage && <div className="alert alert-danger" role="alert">{failedMessage}</div>}
              <FileUpload id='rap-file' label='Audio File' accept='audio/*' onChange={file => setFile(file)} required />
              <TextField id='title' label='Title' type='text' required value={details.title} onChange={title => setDetails({ ...details, title })} />
              <Select<string> id='rapper' label='Artist' required options={rappers} getKey={o => o} getLabel={o => o} value={details.rapper} onChange={rapper => setDetails({ ...details, rapper })} />
              <Select<Event> id='event' label='Event' required options={events} getKey={e => getEventLabel(e)} getLabel={e => getEventLabel(e)} value={details.appearedAt} onChange={appearedAt => setDetails({ ...details, appearedAt })} />
              <TextField id='image-url' label='Image URL' type='text' required value={details.imageUrl} onChange={imageUrl => setDetails({ ...details, imageUrl })}/>
              <Checkbox id='bonus' label='Bonus Track' value={details.bonus} onChange={bonus => setDetails({ ...details, bonus })}/>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-secondary' type='button' onClick={close}>Back</button>
              <button className='btn btn-primary' type='submit'>↑ Upload</button>
            </div>
          </Form>
          :
          <div className='modal-body'>
            <ProgressBar progress={progress} />
          </div>
        }
      </Modal>
    }
  </>);
};
