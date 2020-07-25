import React, { useState } from 'react'

export const Form: React.FC<{ onSubmit: () => void }> = ({ children, onSubmit }) =>
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>{children}</form>

const FormGroup: React.FC = ({ children }) =>
  <div className='form-group'>{children}</div>

export const TextField: React.FC<{
  id: string
  label: string
  type: 'text' | 'email'
  value?: string
  required?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}> = ({ id, label, type, value, required, disabled, onChange }) =>
  <FormGroup>
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      className='form-control'
      id={id}
      value={value}
      required={required}
      disabled={disabled}
      onChange={event => onChange(event.target.value)}/>
  </FormGroup>

export const Checkbox: React.FC<{
  id: string
  label: string
  value?: boolean
  required?: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}> = ({ id, label, value, required, disabled, onChange }) =>
  <div className='form-check'>
    <input
      className='form-check-input'
      type='checkbox'
      checked={value}
      id={id}
      required={required}
      disabled={disabled}
      onChange={event => onChange(event.target.checked)}/>
    <label className='form-check-label' htmlFor={id}>{label}</label>
  </div>

interface SelectProps<T> {
  id: string
  label: string
  options: T[]
  getKey: (option: T) => string
  getLabel: (option: T) => string
  value?: T
  required?: boolean
  disabled?: boolean
  onChange: (value: T) => void
}

export function Select<T>(props: React.PropsWithChildren<SelectProps<T>>): JSX.Element {
  const { id, label, options, getKey, getLabel, value, required, disabled, onChange } = props;
  return (
    <FormGroup>
      <label htmlFor={id}>{label}</label>
        <select
          className='custom-select'
          id={id}
          value={value ? options.findIndex(option => getKey(option) === getKey(value)) : undefined}
          required={required}
          disabled={disabled}
          onChange={event => onChange(options[Number(event.target.value)])}>
          <option></option>
          {options.map((option, index) =>
            <option key={getKey(option)} value={index}>{getLabel(option)}</option>
          )}
      </select>
    </FormGroup>
  )
}

export const FileUpload: React.FC<{
  id: string
  label?: string
  accept?: string
  required?: boolean
  disabled?: boolean
  onChange: (file: File) => void
}> = ({ id, label, accept, required, disabled, onChange }) => {
  const defaultText = 'Choose file...';
  const [filename, setFilename] = useState(defaultText);
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      setFilename(file.name);
      onChange(file);
    }
  }
  return (
    <FormGroup>
      {label && (<label htmlFor={`${id}-wrapper`}>{label}</label>)}
      <div id={`${id}-wrapper`} className='custom-file'>
        <input
          id={id}
          type='file'
          className='custom-file-input'
          accept={accept}
          required={required}
          disabled={disabled}
          onChange={onChangeFile}/>
        <label className='custom-file-label text-truncate' htmlFor={id}>{filename}</label>
      </div>
    </FormGroup>
  )
}