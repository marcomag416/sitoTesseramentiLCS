select amm.id, amm.mail, sq.nome as squadra, sq.id as idsquadra, stag.nome as stagione, stag.id as idstagione, leghe.nome as lega  
from amministratori as amm, sessioni as sess, squadre as sq, stagioni as stag, leghe 
where amm.id_squadra = sq.id and amm.id_stagione = stag.id and sq.id_lega = leghe.id and stag.scadenza > CURRENT_DATE and sess.id_amministratore = amm.id 
and sess.token = :token order by amm.id;