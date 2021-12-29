update d_tesserati set id_stagione = -id_stagione where id_giocatore = :iddirigente and EXISTS
(select * from dirigenti dir where dir.id = :iddirigente and dir.id_squadra = :idsquadra);