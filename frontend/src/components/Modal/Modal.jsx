import React from 'react';
import './Modal.css';
import closeIcon from '@/assets/cross.svg'

const Modal = ({ type, message, onClose }) => {
  return (
    <div className='modal__overlay'>
      <div className='modal__content'>
        {type == 'error' && 
        <h3 className='content__title'>Ошибка</h3>
        }
        <p className='content__description'>{message}</p>
        <button onClick={onClose} className='modal__close-button'>
          <img src={closeIcon}/>
        </button>
      </div>
    </div>
  );
};

export default Modal;