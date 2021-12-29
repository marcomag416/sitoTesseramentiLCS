INSERT into dirigenti (cf, nome, cognome, id_squadra) values (:cf, :nome, :cognome, :idsquadra);
insert into d_tesserati (id_stagione, id_giocatore) select :idstagione, 
(select max(dir.id) from dirigenti dir where dir.cf = :cf and dir.nome = :nome and dir.cognome = :cognome and dir.id_squadra = :idsquadra GROUP by dir.cf);