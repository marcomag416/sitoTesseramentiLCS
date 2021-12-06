select distinct * from (Select gio.id, gio.cf as cf, gio.nome, gio.cognome, gio.classe, gio.data_nascita, gio.luogo_nascita, gio.ruolo, gio.taglia, gio.numero_maglia, max(cmed.scadenza)as scadenza FROM sessioni sess
inner join amministratori amm on amm.id = sess.id_amministratore and sess.token = :token
inner join squadre sq on amm.id_squadra = sq.id,
g_tesserati gtess
inner join giocatori gio on gtess.id_giocatore = gio.id
left join certificati_med cmed on cmed.id_giocatore = gio.id,
stagioni stag
WHERE stag.id = gtess.id_stagione and stag.id = amm.id_stagione and stag.scadenza > CURRENT_DATE and gio.id_squadra = sq.id
group by gio.id order by gio.id) tabA
left join (select fisico, scadenza from certificati_med )cmed on cmed.scadenza = tabA.scadenza;