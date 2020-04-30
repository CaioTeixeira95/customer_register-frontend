import "date-fns";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { MdAdd, MdDelete } from "react-icons/md";
import InputMask from "react-input-mask";
import DateFnsUtils from "@date-io/date-fns";
import locale from "date-fns/locale/pt-BR";
import moment from "moment";

import api from "../../services/api";
import { getToken } from "../../utils/auth";

import "./index.scss";

export default function Form(props) {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [rg, setRg] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [addresses, setAddresses] = useState([
    {
      id: null,
      street: "",
      zipCode: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
      autoFocus: false,
    },
  ]);

  const nameRef = useRef();

  function addAddress() {
    setAddresses([
      ...addresses,
      {
        id: null,
        street: "",
        zipCode: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        autoFocus: true,
      },
    ]);
  }

  function removeAddress(index) {
    addresses.splice(index, 1);
    setAddresses([...addresses]);
  }

  function handleAddressFields(index, event) {
    const { name, value } = event.target;
    let a = [...addresses];
    a[index] = { ...a[index], [name]: value };
    setAddresses(a);
  }

  async function handleSave() {
    const config = {
      headers: {
        Authorization: `Token ${getToken()}`,
      },
    };

    let bday = moment(birthday).format("YYYY-MM-DD");

    let data = {
      name,
      document,
      rg,
      phone,
      birthday: bday,
    };

    let a = addresses.map((address) => {
      if (address.id === null) {
        delete address["id"];
      }
      return address;
    });

    data = { ...data, addresses: a };

    if (id) {
      try {
        await api.put(`api/customer/${id}/`, data, config);
        props.setSnackMessage("Cliente atualizado com sucesso!");
        props.setSnackBarType("success");
        props.loadCustomers();
        props.handleCloseForm();
      } catch (error) {
        props.setSnackMessage("Erro ao atualizar cliente! Tente novamente");
        props.setSnackBarType("error");
      }
      props.handleOpenSnackBar();
    } else {
      try {
        await api.post(`api/customer/`, data, config);
        props.setSnackMessage("Cliente cadastrado com sucesso!");
        props.setSnackBarType("success");
        props.loadCustomers();
        props.handleCloseForm();
      } catch (error) {
        props.setSnackMessage("Erro ao cadastrar cliente! Tente novamente");
        props.setSnackBarType("error");
      }
    }
    props.handleOpenSnackBar();
  }

  function cleanStates() {
    setId(null);
    setName("");
    setDocument("");
    setRg("");
    setPhone("");
    setBirthday(new Date());
    setAddresses([
      {
        id: null,
        street: "",
        zipCode: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        autoFocus: false,
      },
    ]);
  }

  useEffect(() => {
    const customer = props.customerData;

    cleanStates();

    if (Object.keys(customer).length) {
      setId(customer.id);
      setName(customer.name);
      setDocument(customer.document);
      setRg(customer.rg);
      setPhone(customer.phone);
      setBirthday(customer.birthday);
      setAddresses(customer.addresses);
    }
  }, [props.customerData]);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleCloseForm}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Novo cliente</DialogTitle>
      <DialogContent>
        <TextField
          ref={nameRef}
          autoFocus
          margin="dense"
          label="Nome completo"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
        <Grid container direction="row" justify="space-between">
          <Grid item xs={5} md={5}>
            <InputMask
              mask="999.999.999-99"
              value={document}
              onChange={(event) => setDocument(event.target.value)}
            >
              <TextField
                margin="dense"
                label="CPF"
                type="text"
                fullWidth

              />
            </InputMask>
          </Grid>
          <Grid item xs={5} md={5}>
            <InputMask
              mask="99.999.999-9"
              value={rg}
              onChange={(event) => setRg(event.target.value)}
            >
              <TextField
                margin="dense"
                label="RG"
                type="text"
                fullWidth

              />
            </InputMask>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item xs={12} md={5}>
            <InputMask
              mask="(99)99999-9999"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            >
              <TextField
                margin="dense"
                label="Telefone"
                type="tel"
                fullWidth

              />
            </InputMask>
          </Grid>
          <Grid item xs={12} md={5}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
              <KeyboardDatePicker
                fullWidth
                margin="dense"
                id="date-picker-dialog"
                label="Data de nascimento"
                format="dd/MM/yyyy"
                value={moment(birthday)}
                onChange={(date) => setBirthday(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}

              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <DialogTitle>
          Endereços
          <IconButton
            size="small"
            style={{
              backgroundColor: "#F50057",
              color: "#fff",
              marginLeft: 10,
            }}
            onClick={addAddress}
          >
            <MdAdd />
          </IconButton>
        </DialogTitle>
        {addresses.map((address, index) => (
          <div key={index} className="address">
            <TextField
              autoFocus={address?.autoFocus}
              margin="dense"
              label="Logradouro"
              type="text"
              name="street"
              value={address.street}
              onChange={(event) => handleAddressFields(index, event)}
              fullWidth

            />
            <Grid container direction="row" justify="space-between">
              <Grid item xs={4} md={5}>
                <InputMask
                  mask="99999-999"
                  value={address.zipCode}
                  onChange={(event) => handleAddressFields(index, event)}
                >
                  <TextField
                    margin="dense"
                    fullWidth
                    label="CEP"
                    type="text"
                    name="zipCode"

                  />
                </InputMask>
              </Grid>
              <Grid item xs={7} md={5}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Bairro"
                  type="text"
                  name="neighborhood"
                  value={address.neighborhood}
                  onChange={(event) => handleAddressFields(index, event)}

                />
              </Grid>
            </Grid>
            <Grid container direction="row" justify="space-between">
              <Grid item xs={12} md={5}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Cidade"
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={(event) => handleAddressFields(index, event)}

                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Estado"
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={(event) => handleAddressFields(index, event)}

                />
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={8} md={5}>
                <TextField
                  margin="dense"
                  label="País"
                  type="text"
                  name="country"
                  fullWidth
                  value={address.country}
                  onChange={(event) => handleAddressFields(index, event)}

                />
              </Grid>
              {index !== 0 && (
                <Grid item xs={3} md={5}>
                  <IconButton
                    size="small"
                    onClick={() => removeAddress(index)}
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 0,
                      backgroundColor: "#F50057",
                      color: "#fff",
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseForm} color="default">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
