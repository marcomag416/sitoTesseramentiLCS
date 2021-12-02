update g_tesserati set id_stagione = 0 where id_giocatore = :idgiocatore and EXISTS
(select * from giocatori gio where gio.id = :idgiocatore and gio.id_squadra = :idsquadra);