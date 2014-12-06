/*!
 * sl stopwords addon for JavaScript tag cloud builder v0.2
 * http://autotagcloud.com/
 *
 * Copyright 2013.03.09, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */
(function() {
var stopwords = {
"a" : null,
"ali" : null,
"april" : null,
"avgus" : null,
"b" : null,
"bi" : null,
"bil" : null,
"bila" : null,
"bile" : null,
"bili" : null,
"bilo" : null,
"biti" : null,
"bliz" : null,
"bo" : null,
"bodo" : null,
"bojo" : null,
"bolj" : null,
"bom" : null,
"bomo" : null,
"bo\u0161" : null,
"bost" : null,
"bova" : null,
"brez" : null,
"c" : null,
"\u010d" : null,
"\u010de" : null,
"cel" : null,
"cela" : null,
"celi" : null,
"celo" : null,
"\u010dest" : null,
"\u010detr" : null,
"\u010detrtek" : null,
"\u010dez" : null,
"\u010digav" : null,
"d" : null,
"da" : null,
"dale\u010d" : null,
"dan" : null,
"danes" : null,
"datu" : null,
"december" : null,
"dese" : null,
"deset" : null,
"deve" : null,
"devet" : null,
"do" : null,
"dober" : null,
"dobr" : null,
"dokler" : null,
"dol" : null,
"dolg" : null,
"dovol" : null,
"drug" : null,
"dva" : null,
"dve" : null,
"e" : null,
"eden" : null,
"en" : null,
"ena" : null,
"ene" : null,
"eni" : null,
"enkr" : null,
"eno" : null,
"etc." : null,
"f" : null,
"februar" : null,
"g" : null,
"g." : null,
"ga" : null,
"ga." : null,
"gor" : null,
"gosp" : null,
"gospod" : null,
"h" : null,
"halo" : null,
"i" : null,
"idr." : null,
"ii" : null,
"iii" : null,
"in" : null,
"iv" : null,
"ix" : null,
"iz" : null,
"j" : null,
"januar" : null,
"jaz" : null,
"je" : null,
"ji" : null,
"jih" : null,
"jim" : null,
"jo" : null,
"julij" : null,
"junij" : null,
"jutr" : null,
"k" : null,
"kadarkol" : null,
"kaj" : null,
"kajt" : null,
"kako" : null,
"kakor" : null,
"kamor" : null,
"kamorkol" : null,
"kar" : null,
"karkol" : null,
"katerikol" : null,
"kdaj" : null,
"kdo" : null,
"kdorkol" : null,
"ker" : null,
"ki" : null,
"kje" : null,
"kjer" : null,
"kjerkol" : null,
"ko" : null,
"koder" : null,
"koderkol" : null,
"koga" : null,
"komu" : null,
"kot" : null,
"krat" : null,
"kratek" : null,
"kratk" : null,
"l" : null,
"lahk" : null,
"le" : null,
"lep" : null,
"lepa" : null,
"lepe" : null,
"lepi" : null,
"lepo" : null,
"leto" : null,
"m" : null,
"maj" : null,
"majh" : null,
"majhn" : null,
"malc" : null,
"malo" : null,
"manj" : null,
"mare" : null,
"me" : null,
"med" : null,
"medt" : null,
"mene" : null,
"mese" : null,
"mi" : null,
"midv" : null,
"mnog" : null,
"moj" : null,
"moja" : null,
"moje" : null,
"mora" : null,
"morat" : null,
"more" : null,
"mu" : null,
"n" : null,
"na" : null,
"nad" : null,
"naj" : null,
"najin" : null,
"najm" : null,
"naju" : null,
"najve\u010d" : null,
"nam" : null,
"narob" : null,
"nas" : null,
"na\u0161" : null,
"nato" : null,
"nazaj" : null,
"ne" : null,
"nedav" : null,
"nedel" : null,
"nek" : null,
"neka" : null,
"nekaj" : null,
"nekater" : null,
"nekd" : null,
"neke" : null,
"neki" : null,
"nekj" : null,
"neko" : null,
"nekog" : null,
"ni" : null,
"ni\u010d" : null,
"nikamor" : null,
"nikdar" : null,
"nikjer" : null,
"nikol" : null,
"nje" : null,
"njeg" : null,
"njej" : null,
"njem" : null,
"njen" : null,
"nji" : null,
"njih" : null,
"njij" : null,
"njim" : null,
"njo" : null,
"njun" : null,
"no" : null,
"nocoj" : null,
"november" : null,
"npr." : null,
"o" : null,
"ob" : null,
"oba" : null,
"obe" : null,
"oboj" : null,
"od" : null,
"odpr" : null,
"odprt" : null,
"okol" : null,
"oktober" : null,
"on" : null,
"onadv" : null,
"one" : null,
"oni" : null,
"onidv" : null,
"osem" : null,
"osma" : null,
"osmi" : null,
"osmo" : null,
"oz." : null,
"p" : null,
"pa" : null,
"pet" : null,
"peta" : null,
"petek" : null,
"peti" : null,
"peto" : null,
"po" : null,
"pod" : null,
"pogos" : null,
"poleg" : null,
"poln" : null,
"ponavad" : null,
"ponedeljek" : null,
"ponov" : null,
"pote" : null,
"povsod" : null,
"pozdrav" : null,
"prav" : null,
"praz" : null,
"prazn" : null,
"prbl." : null,
"precej" : null,
"pred" : null,
"prej" : null,
"prek" : null,
"pri" : null,
"pribl." : null,
"pribli\u017e" : null,
"primer" : null,
"priprav" : null,
"prot" : null,
"prva" : null,
"prvi" : null,
"prvo" : null,
"r" : null,
"ravn" : null,
"re\u010d" : null,
"redk" : null,
"res" : null,
"s" : null,
"\u0161" : null,
"saj" : null,
"sam" : null,
"sama" : null,
"same" : null,
"sami" : null,
"samo" : null,
"se" : null,
"sebe" : null,
"sebi" : null,
"sedaj" : null,
"sede" : null,
"sedm" : null,
"sem" : null,
"september" : null,
"\u0161es" : null,
"\u0161est" : null,
"seved" : null,
"si" : null,
"sicer" : null,
"skoraj" : null,
"skoz" : null,
"slab" : null,
"smo" : null,
"so" : null,
"sobot" : null,
"spet" : null,
"sred" : null,
"sredn" : null,
"sta" : null,
"ste" : null,
"\u0161tir" : null,
"stran" : null,
"stvar" : null,
"sva" : null,
"t" : null,
"ta" : null,
"tak" : null,
"taka" : null,
"take" : null,
"taki" : null,
"tako" : null,
"takoj" : null,
"tam" : null,
"te" : null,
"tebe" : null,
"tebi" : null,
"tega" : null,
"te\u017e" : null,
"te\u017eak" : null,
"te\u017ek" : null,
"ti" : null,
"tist" : null,
"tj." : null,
"tja" : null,
"to" : null,
"toda" : null,
"torek" : null,
"tret" : null,
"tretj" : null,
"tri" : null,
"tu" : null,
"tudi" : null,
"tukaj" : null,
"tvoj" : null,
"u" : null,
"v" : null,
"vaju" : null,
"vam" : null,
"vas" : null,
"va\u0161" : null,
"v\u010das" : null,
"v\u010deraj" : null,
"ve" : null,
"ve\u010d" : null,
"vedn" : null,
"veli" : null,
"velik" : null,
"vendar" : null,
"ves" : null,
"vi" : null,
"vidv" : null,
"vii" : null,
"viii" : null,
"viso" : null,
"visok" : null,
"vsa" : null,
"vsaj" : null,
"vsak" : null,
"vsakomur" : null,
"vse" : null,
"vseg" : null,
"vsi" : null,
"vso" : null,
"x" : null,
"z" : null,
"\u017e" : null,
"za" : null,
"zadaj" : null,
"zadnj" : null,
"zakaj" : null,
"zapr" : null,
"zaprt" : null,
"zdaj" : null,
"\u017ee" : null,
"zelo" : null,
"zunaj" : null
};
Taggregator.addStopList('sl', stopwords);
}());
