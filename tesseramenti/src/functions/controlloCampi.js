export default function controllaCf(obj, setMsg)
{
	var validi, i, s, set1, set2, setpari, setdisp, cf;
	cf = obj.value;
	if( cf == '' )  return false; 
	cf = cf.toUpperCase();
	if( cf.length != 16 ) {
        obj.focus();
		setMsg('Codice fiscale non valido');
		return false; 
    }
	validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for( i = 0; i < 16; i++ ){
		if( validi.indexOf( cf.charAt(i) ) == -1 ) {
            obj.focus();
            setMsg('Il codice fiscale contiene un carattere non valido: '+ cf.charAt(i));
            return false; 
        }
	}
	set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
	setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
	s = 0;
	for( i = 1; i <= 13; i += 2 )
		s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
	for( i = 0; i <= 14; i += 2 )
		s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
	if( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) ) {
        obj.focus();
        setMsg('Il codice fiscale non è corretto');
        return false; 
    }
    return true;
}