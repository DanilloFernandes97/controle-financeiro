import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import TransactionService from '../../services/TransactionService';

import './style.css';

Modal.setAppElement('#root');

export default function ModalTransaction({
  opened,
  objTransaction,
  typeOperation,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    openModal();
    if (objTransaction) {
      console.log(objTransaction._id);
      let {
        type,
        category,
        description,
        value,
        day,
        month,
        year,
      } = objTransaction;
      day = day.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
      });
      month = month.toLocaleString('pt-BR', {
        style: 'decimal',
        minimumIntegerDigits: 2,
      });

      setType(type);
      setCategory(category);
      setDescription(description);
      setValue(value);

      setDate(`${year}-${month}-${day}`);
    }
  }, []);

  function openModal() {
    setModalIsOpen(true);
    opened(true);
  }
  function closeModal() {
    setModalIsOpen(false);
    opened(false);
  }

  function handleClickType(event) {
    if (typeOperation != 'Edição/Remoção') setType(event.target.value);
  }

  function handleCategoryInput(event) {
    const category = event.target.value.trim();
    setCategory(category);
  }

  function handleDescriptionInput(event) {
    const description = event.target.value.trim();
    setDescription(description);
  }

  function handleValueInput(event) {
    const value = +event.target.value;

    setValue(value);
  }

  function handleDateInput(event) {
    setDate(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const [year, month, day] = date.split('-');
    const yearMonth = `${year}-${month}`;

    const transaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonthDay: date,
      yearMonth,
      type,
    };
    if (typeOperation === 'Inclusão') {
      const newTransaction = await TransactionService.create(transaction);
      if (newTransaction.status === 200)
        alert('Transação inserida com sucesso!');
      else alert('Erro ao tentar adicionar transação!');
    } else {
      console.log('aquiiii', objTransaction._id);
      const updatedTransaction = await TransactionService.update(
        objTransaction._id,
        transaction
      );
    }

    closeModal();
  }

  return (
    <div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <header className="headerModal">
          <h2>{typeOperation} de Lançamento</h2>
          <button onClick={closeModal}>X</button>
        </header>
        <form className="formNewTransaction" onSubmit={handleSubmit}>
          <div className="radioType">
            <label htmlFor="despesa">
              <input
                type="radio"
                name="type"
                id="despesa"
                value="-"
                onClick={handleClickType}
                onChange={handleClickType}
                checked={type === '-' ? true : false}
                readOnly={typeOperation === 'Edição/Remoção' ? true : false}
                disabled={typeOperation === 'Edição/Remoção' ? true : false}
              />{' '}
              <span
                style={{
                  color: '#C0392B',
                  fontWeight: 'bold',
                }}
              >
                Despesa
              </span>
            </label>
            <label htmlFor="receita">
              <input
                type="radio"
                id="receita"
                name="type"
                value="+"
                checked={type === '+' ? true : false}
                onClick={handleClickType}
                onChange={handleClickType}
                readOnly={typeOperation === 'Edição/Remoção' ? true : false}
                disabled={typeOperation === 'Edição/Remoção' ? true : false}
              />{' '}
              <span
                style={{
                  color: '#50BD7E',
                  fontWeight: 'bold',
                }}
              >
                Receita
              </span>
            </label>
          </div>
          <div className="textInfo">
            <label htmlFor="description">Descrição</label>
            <input
              placeholder="Descrição"
              id="description"
              type="text"
              value={description}
              onChange={handleDescriptionInput}
              required
            />

            <label htmlFor="category">Categoria</label>
            <input
              placeholder="Categoria"
              id="category"
              type="text"
              value={category}
              onChange={handleCategoryInput}
              required
            />
          </div>
          <div className="valueAndDate">
            <div className="valueInput">
              <label htmlFor="value">Valor</label>
              <input
                placeholder="Valor"
                id="value"
                type="number"
                value={value}
                onChange={handleValueInput}
                onClick={handleValueInput}
              />
            </div>
            <div className="dateInput">
              <label htmlFor="date"></label>
              <input
                type="date"
                name="date"
                id="date"
                pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
                value={date}
                onChange={handleDateInput}
                required
              />
            </div>
          </div>

          <input type="submit" onClick={handleSubmit} value="SALVAR" />
        </form>
      </Modal>
    </div>
  );
}
