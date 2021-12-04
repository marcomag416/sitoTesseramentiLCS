insert into certificati_med (scadenza, file, fisico, id_giocatore) values (:scadenza, :nomefile, 0, (
select max(gio.id) from giocatori gio where gio.cf = :cf and gio.nome = :nome and gio.cognome = :cognome and gio.data_nascita = :data_nascita and gio.id_squadra = :idsquadra GROUP by gio.cf
));