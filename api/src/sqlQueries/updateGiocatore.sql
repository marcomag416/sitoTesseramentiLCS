update giocatori gio 
set cf = :cf, nome = :nome, cognome = :cognome, data_nascita = :data_nascita, luogo_nascita = :luogo_nascita, classe = :classe, ruolo = :ruolo, taglia = :taglia, numero_maglia = :numero 
where id = :idgiocatore and id_squadra = :idsquadra;