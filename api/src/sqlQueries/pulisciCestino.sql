delete from giocatori where giocatori.id in (select gtess.id_giocatore from g_tesserati gtess where gtess.id_stagione < 0);
delete from g_tesserati where g_tesserati.id_stagione < 0;