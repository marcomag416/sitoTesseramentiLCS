select * 
from giocatori gio inner join g_tesserati gtess on gtess.id_giocatore = gio.id 
where gio.id = :idgiocatore and gio.id_squadra = :idsquadra and gtess.id_stagione = :idstagione;