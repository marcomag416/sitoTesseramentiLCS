SELECT stag.nome stagione, sq.nome squadra, gio.nome, gio.cognome, gio.cf, gio.data_nascita, gio.luogo_nascita, gio.classe, gio.taglia, gio.numero_maglia, gio.ruolo, max(cert.scadenza) as "scadenza cert"
FROM certificati_med cert
right join giocatori gio on cert.id_giocatore = gio.id 
inner join g_tesserati gtess on gtess.id_giocatore = gio.id 
left join stagioni stag on stag.id = gtess.id_stagione 
left join squadre sq on sq.id = gio.id_squadra 
WHERE stag.id = 3 
group by stag.nome, sq.nome, gio.nome, gio.cognome, gio.cf, gio.data_nascita, gio.luogo_nascita, gio.classe, gio.taglia, gio.numero_maglia, gio.ruolo 
order by sq.nome, gio.cognome, gio.nome;