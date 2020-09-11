import React, { useState } from 'react';

import './style.css';
import ModalTransaction from '../ModalTransaction';
import TransactionService from '../../services/TransactionService';

export default function Transaction({ transaction }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { category, description, value, type, day } = transaction;

  function handleClickEditModal(isOpen) {
    setModalIsOpen(isOpen);
  }

  async function handleClickDeleteModal() {
    const { _id } = transaction;
    const deletedTransaction = await TransactionService.remove(_id);
    console.log(deletedTransaction);
  }

  const styles = type === '+' ? 'positive' : 'negative';

  return (
    <div className={`transaction ${styles}`}>
      <div className="number">
        <span>{day.toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}</span>
      </div>
      <div className="info">
        <div className="category">
          <span>{category}</span>
        </div>
        <div className="description">
          <span>{description}</span>
        </div>
      </div>
      <div className="value">
        <span>
          {value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </div>
      <div className="options">
        <span onClick={handleClickEditModal}>
          <i className="tiny material-icons">edit</i>
        </span>
        <span onClick={handleClickDeleteModal}>
          <i className="tiny material-icons">delete</i>
        </span>
      </div>
      {modalIsOpen && (
        <ModalTransaction
          opened={handleClickEditModal}
          objTransaction={transaction}
          typeOperation={'Edição'}
        />
      )}
    </div>
  );
}
