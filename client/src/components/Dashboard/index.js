import React, { useState, useEffect } from 'react';
import './style.css';

import TransactionService from '../../services/TransactionService';
import Transaction from '../Transaction';
import ModalTransaction from '../ModalTransaction';

export default function Dashboard() {
  const [yearMonth, setYearMonth] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [modalNewTransactionIsOpen, setModalNewTransactionIsOpen] = useState(
    false
  );

  //initialState yearMonth
  useEffect(() => {
    const date = new Date();
    let month = date.getMonth() + 1;
    month = month.toLocaleString('pt-BR', {
      minimumIntegerDigits: 2,
    });
    const year = date.getFullYear();
    setYearMonth(`${year}-${month}`);
  }, []);

  useEffect(() => {
    // fazer consulta no banco e retornar os periodos
    const getPeriods = async () => {
      const periods = await TransactionService.getAll();
      setPeriods(periods.data);
    };
    const getTransactions = async () => {
      const filteredTransactions = await TransactionService.get(yearMonth);
      console.log(filteredTransactions);
      let transactions = filteredTransactions.data;

      transactions = transactions.sort((a, b) => a.day - b.day);

      setTransactions(transactions);
      setFilteredTransactions(transactions);
    };

    getPeriods();
    getTransactions();
  }, [yearMonth]);

  async function handleChangeSelect(event) {
    //tras as transactions de acordo com o periodo selecionado

    setYearMonth(event.target.value);
    const filteredTransactions = await TransactionService.get(
      event.target.value
    );
    setTransactions(filteredTransactions.data);
  }

  function handleChangeButtonPreviousPeriod() {
    const index = periods.findIndex((period) => period === yearMonth);
    if (index > 0) setYearMonth(periods[index - 1]);
  }

  function handleChangeButtonNextPeriod() {
    const index = periods.findIndex((period) => period === yearMonth);
    if (index < periods.length - 1) setYearMonth(periods[index + 1]);
  }

  function handleClickNewTransaction(isOpen) {
    setModalNewTransactionIsOpen(isOpen);
  }

  function handleFilterDescription(event) {
    const filter = event.target.value.trim();

    if (filter.length > 0) {
      const filtered = transactions.filter((transaction) =>
        transaction.description.includes(filter)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Bootcamp Full Stack - Desafio Final</h1>
        <h3>Controle Financeiro Pessoal</h3>
      </header>
      {/* FILTRO */}
      {/* options vai ser de acordo com o que tem no banco de dados */}
      <form onSubmit={(event) => event.preventDefault()}>
        <div>
          <button onClick={handleChangeButtonPreviousPeriod}>&lt;</button>
        </div>
        <label>
          <select
            value={yearMonth}
            onChange={handleChangeSelect}
            className="browser-default"
          >
            {periods.map((period, key) => {
              return <option key={key}>{period}</option>;
            })}
          </select>
        </label>
        <div>
          <button onClick={handleChangeButtonNextPeriod}>&gt;</button>
        </div>
      </form>
      {/* INFOS FILTRO */}
      <div className="resume">
        <span>Lançamentos: {filteredTransactions.length} </span>
        <span>
          Receitas:
          {filteredTransactions
            .filter((transaction) => transaction.type === '+')
            .reduce((acc, curr) => acc + curr.value, 0)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        <span>
          Despesas:
          {filteredTransactions
            .filter((transaction) => transaction.type === '-')
            .reduce((acc, curr) => acc + curr.value, 0)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        <span>
          Saldo:
          {filteredTransactions
            .reduce(
              (acc, curr) =>
                curr.type === '+' ? acc + curr.value : acc - curr.value,
              0
            )
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <div className="addSearchTransaction">
        <button onClick={handleClickNewTransaction}>
          <span>+</span> Novo Lançamento
        </button>
        {modalNewTransactionIsOpen && (
          <ModalTransaction
            opened={handleClickNewTransaction}
            typeOperation={'Inclusão'}
          />
        )}

        <input
          type="text"
          name="filtroNomeTransacao"
          id="filtroNomeTransacao"
          placeholder="Filtro"
          onChange={handleFilterDescription}
        />
      </div>
      <div className="transactions">
        {filteredTransactions.map((transaction, key) => {
          return <Transaction transaction={transaction} key={key} />;
        })}
      </div>
    </div>
  );
}
