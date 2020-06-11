import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './header';
import { 
    Container, 
    Table, 
    TableRow, 
    TableHead,
    TableBody,
    TableCell,  
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent,
    DialogContentText, 
    TextField,
    DialogActions } from '@material-ui/core';
import './style.css';


function App() {

    const [ lista, setLista ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ nome, setNome] = useState('');
    const [ cantor, setCantor] = useState('');
    const [ ano, setAno] = useState('');

    function loadData() {
        api.get('/musicas').then((response) => {
            const itens = response.data;
            setLista(itens);
        })
    }

    useEffect(() => loadData(), []);

    const openModal = () => setOpen(true);

    const closeModal = () => setOpen(false);

    //Função para adicionar uma nova música
    function addMusicas() { 
        const name = nome;
        const singer = cantor;
        const year = ano;
        api.post('/musica', { nome: name, singer: cantor, ano: year }).then((response) => {
        setNome('');
        setCantor('');
        setAno('');
        setOpen(false);
        loadData()
        })
     }

     //Função para marcar uma música como 'Não gosto'
    function markAsGosta(id, gosta) {
        if(gosta === true){
            api.patch(`/musicas/${id}/naogosta`).then((response) => {
                loadData()
            });
        } else {
                api.patch(`/musicas/${id}/gosta`).then((response) => {
                loadData()
            });
        }
    }


    //Função para excluir uma música da lista.
     function deleteMusicas(id) {
         api.delete(`/musicas/${id}`).then((response) => {
            loadData()
         })
     }


    return (
        <>
        <Header />
        <Container maxWidth="lg" className="container">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome da Musica</TableCell>
                        <TableCell>Cantor</TableCell>
                        <TableCell>Ano de lançamento</TableCell>
                        <TableCell>Gosta?</TableCell>
                        <TableCell>Apagar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lista.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell>{item.cantor}</TableCell>
                            <TableCell>{item.ano}</TableCell>
                            <TableCell>
                                <input type="checkbox" 
                                onChange={() => markAsGosta(item.id, item.gosta)}                   
                                checked={item.gosta === true ? true : false}/>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => deleteMusicas(item.id)} >Apagar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button 
                onClick={openModal}
                variant="contained" 
                color="primary" 
                style={{marginTop: '20px'}}>
                Adicionar
            </Button>
            </Container>
            <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Nova Música</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite a música que gostaria adicionar.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        label="Musicas"
                        type="text"
                        fullWidth
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="Cantor"
                        label="Cantor"
                        type="text"
                        fullWidth
                        value={cantor}
                        onChange={e => setCantor(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="ano"
                        label="Ano"
                        type="number"
                        fullWidth
                        value={ano}
                        onChange={e => setAno(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={addMusicas} color="primary">
                        Salvar
                    </Button>
                 </DialogActions>
            </Dialog>
        </>
    );

}

export default App;
