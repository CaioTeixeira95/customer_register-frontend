import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';

import "./style.scss";

import Header from "../../components/Header";
import Form from "../../components/Form";

import api from "../../services/api";
import { getToken } from '../../utils/auth';


export default function Customer() {

  const [openForm, setOpenForm] = useState(false);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');

  const [customers, setCustomers] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function handleOpenForm(customer = {}) {
    if (Object.keys(customer).length) {
      const c = JSON.parse(JSON.stringify(customer));
      setCustomerData(c);
    }
    setOpenForm(true);
  }

  function handleCloseForm() {
    setOpenForm(false);
    setCustomerData({});
  }

  function handleOpenSnackBar() {
    setOpenSnackBar(true);
  }

  function handleCloseSnackBar() {
    setOpenSnackBar(false);
    setSnackMessage('');
  }

  async function handleDelete(customer) {
    if (window.confirm('Deseja realmente deletar?')) {
      try {
        await api.delete(`api/customer/${customer.id}`, {
          headers: {
            Authorization: `Token ${getToken()}`,
          },
        });
        setSnackMessage('Cliente deletado com sucesso!');
        setSnackBarType('success');
      } catch (error) {
        setSnackMessage('Erro ao deletar cliente!');
        setSnackBarType('error');
      }
      setOpenSnackBar(true);
      loadCustomers()
    }
  }

  async function loadCustomers(pages = 1) {
    const { data: { count, results } } = await api.get(`api/customer/?page=${pages}`, {
      headers: {
        Authorization: `Token ${getToken()}`,
      },
    });
    setPage(pages);
    setCustomers(results);
    setTotalPages(Math.ceil(count / 5));
  }

  function handlePagination(event, value) {
    loadCustomers(value);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <>
      <Header />

      <div className="container">
        <div className="add-container">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<MdAdd />}
            size="large"
            onClick={() => handleOpenForm()}
          >
            Novo cliente
          </Button>
        </div>

        <Form
          open={openForm}
          handleCloseForm={handleCloseForm}
          customerData={customerData}
          loadCustomers={loadCustomers}
          setSnackMessage={setSnackMessage}
          setSnackBarType={setSnackBarType}
          handleOpenSnackBar={handleOpenSnackBar}
        />

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          key={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <MuiAlert
            severity={snackBarType}
          >
            {snackMessage}
          </MuiAlert>
        </Snackbar>

        {customers.length ? (
          <>
            <Table responsive striped hover variant="dark">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>RG</th>
                  <th>Telefone</th>
                  <th>Data de Nascimento</th>
                  <th colSpan="2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.document}</td>
                    <td>{customer.rg}</td>
                    <td>{customer.phone}</td>
                    <td>{moment(customer.birthday).format('DD/MM/YYYY')}</td>
                    <td>
                      <IconButton
                        size="small"
                        component="span"
                        onClick={() => handleOpenForm(customer)}
                      >
                        <MdEdit color="#fff" />
                      </IconButton>
                    </td>
                    <td>
                      <IconButton
                        size="small"
                        component="span"
                        onClick={() => handleDelete(customer)}
                      >
                        <MdDelete color="#E32341" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination count={totalPages} page={page} onChange={handlePagination} />
          </>
        ) : (
          <h2>
            Não há nenhum cliente cadastrado
          </h2>
        )}
      </div>
    </>
  );
}
