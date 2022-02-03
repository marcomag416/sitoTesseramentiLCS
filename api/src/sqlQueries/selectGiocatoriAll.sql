SELECT DISTINCT stag.nome stagione, sq.nome squadra, gio.nome, gio.cognome, gio.cf, gio.data_nascita, gio.luogo_nascita, gio.classe, gio.taglia, gio.numero_maglia, gio.ruolo FROM giocatori gio inner join g_tesserati gtess on gtess.id_giocatore = gio.id left join stagioni stag on stag.id = gtess.id_stagione left join squadre sq on sq.id = gio.id_squadra WHERE stag.id = 3 order by sq.nome;