# ads.txt audit of HeaderBiddr publishers — 2026-10-23

**Method.** Source list: every seller in https://headerbiddr.com/sellers.json (325 entries, all `PUBLISHER`, last-modified 2026-05-25), fetched 2026-10-23. For each seller `domain`, `GET https://<domain>/ads.txt` (12 s timeout, redirects followed). A response that was not 200, or whose first 500 bytes contained `<html`, counts as unreadable. Lines whose ad system domain is `headerbiddr.com` or `hbdr.com` (comments stripped) were compared with the seller's own `seller_id`.

**Why it matters.** Buyers match the account ID in an ads.txt line to a `seller_id` in the ad system's sellers.json. A line whose ID is another seller's, or no seller's, fails that match.

| Result | Publishers |
|---|---|
| Line matches own seller_id | 65 |
| Line uses another publisher's seller_id | 33 |
| Line uses an ID not in sellers.json | 22 |
| No HeaderBiddr line (fine for Google MCM-only publishers) | 120 |
| ads.txt unreadable | 85 |

## Line uses another publisher's seller_id (33)

| Domain | Own seller_id | IDs in its HeaderBiddr lines |
|---|---|---|
| amarujala.com | 224 | 787326596|298 |
| andhrajyothy.com | 184 | 127 |
| bartamanpatrika.com | 252 | 127 |
| bartamanpatrika.com | 303 | 127 |
| boxofficeindia.com | 249 | 278 |
| creaders.net | 204 | 298 |
| freemalaysiatoday.com | 161 | 278 |
| gmanetwork.com | 172 | 787326596|297|278 |
| indiatimes.com | 207 | 298 |
| jawapos.com | 281 | 208|127|278 |
| juksy.com | 259 | 127|127 |
| Koimoi.com | 287 | 127 |
| lazi.vn | 147 | 298 |
| loomon.club | 300 | 298 |
| manoramaonline.com | 189 | 127|297 |
| matichonweekly.com | 139 | 278 |
| metruyenhot.vn | 292 | 127|291 |
| news18.com | 123 | 278 |
| ngoisao.vnexpress.net | 193 | 127|141 |
| ntv.com.tr | 200 | 201 |
| ntvspor.net | 200 | 201 |
| pilio.idv.tw | 181 | 127|127 |
| pocketfm.com | 137 | 127|298|297 |
| railyatri.in | 236 | 310 |
| republicworld.com | 276 | 278 |
| sarthaks.com | 294 | 278 |
| sunnxt.com | 282 | PUB_ID|298 |
| taiwannews.com.tw | 195 | 298|298 |
| tayyar.org | 254 | 127 |
| tayyar.org | 305 | 127 |
| tribuneindia.com | 230 | 127 |
| vidio.com | 268 | 8201HBhttpswwwvidiocom|298 |
| vnexpress.net | 193 | 127|141 |

## Line uses an ID not in sellers.json (22)

| Domain | Own seller_id | IDs in its HeaderBiddr lines |
|---|---|---|
| ajitjalandhar.com | 186 | 787326596 |
| applealmond.com | 274 | 787326596 |
| bdjobs.com | 251 | 787326596 |
| cna.com.tw | 154 | 787326596|787326596 |
| deepika.com | 199 | 297 |
| detik.com | 266 | 8201HBdetikcom |
| Enewstree.com | 183 | 787326596|787326596 |
| eprice.com.tw | 177 | 787326596 |
| instinctmagazine.com | 112 | 8201hb|8201inst |
| kkplay3c.net | 228 | 787326596 |
| krishijagran.com | 234 | 787326596|787326596 |
| manoramamax.com | 189 | 787326596 |
| marathi.krishijagran.com | 234 | 787326596 |
| newsexpressngr.com | 242 | 787326596|PUB_ID |
| roya.tv | 285 | 787326596 |
| sakshi.com | 160 | 297 |
| sandesh.com | 224 | 787326596|PUB_ID |
| studiobelajar.com | 302 | 787326596 |
| thenewsmen.co.in | 280 | 787326596 |
| tvbanywherena.com | 194 | 297|297 |
| yugatech.com | 244 | 787326596 |
| zigwheels.my | 225 | 787326596 |

## No HeaderBiddr line (120)

Fastchannels.tv, Infoguidenigeria.com, Jpost.com, Tinthethao.com.vn, abs-cbn.com, academiadeestudios.site, acuariosrd.com, agenciasertao.com, altibbi.com, ap7am.com, apkmodjoy.net, apkys.xyz, astroawani.com, ballgametime.com, bangkokpost.com, bhaskar.com, bigfang.tw, bongda.com.vn, breathinglifestyle.com, businessday.ng, buzzorange.com, cainwalker.com, canal-educar.net, cdkitchen.com, checkanswers.co, chennaigames.com, chinatimes.com, codigosdediamantes.com, conoce-japon.com, deshabhimani.com, digitalservices18.com, divyabhaskar.co.in, doubtnut.com, droom.in, elfann.com, elitelifedecor.com, elnashra.com, etvbharat.com, fanatik.com.tr, freepressjournal.in, gempak.com, generadoresonline.store, gevdin.com, glamorself.com, greatteamapps.blogspot.com, guardian.ng, gujaratsamachar.com, haryanaekhabar.com, hindustantimes.com, hinet.net, hockeyreal.online, hurriyet.com.tr, indiastudychannel.com, iwanttfc.com, jagonews24.com, jagran.com, jagranjosh.com, janamtv.com, joongang.co.kr, josegames.one, juegoseducativos.win, kanald.com.tr, khaleejtimes.com, kimchidaily.my, koreajoongangdaily.joins.com, kosmo.com.my, lebanese-forces.com, lyricsmint.com, maharashtratimes.com, managertoday.com.tw, mangalam.com, merdeka.com, milliyet.com.tr, moneycontrol.com, moneylife.in, mpasho.co.ke, mrworldgames.com, mundo3dprint.com, mundoapprd.com, nagalandpost.com, naidunia.com, navbharattimes.indiatimes.com, ndtv.com, nettv4u.com, nkbigstar.in, nst.com.my, ntnews.com, odatv4.com, offidocs.com, peeta.tw, pep.ph, pinkvilla.com, posta.com.tr, rediff.com, sify.com, simsvip.com, skresult.net, spikeybits.com, spin.ph, sportskeeda.com, stylecraze.com, styleforum.net, suara.com, sundayworld.co.za, supervasco.com, talkbass.com, tcl.com, tech-girlz.com, techjunkey.com, theq.tv, theshoesnobblog.com, todaywalkins.net, toploigiai.vn, visioninfotechprivacypolicy.blogspot.com, wentvoyage.com, wishtv.com, wpress.digital, www.kocpc.com.tw, xuan.com.my, zoombangla.com

## ads.txt unreadable (85)

JB, Navodayatimes.in, SD, Wtffunfact.com, air-byte.in, andreytv.com, answersdrive.com, astroulagam.com.my, autocarindia.com, banglanewslive.co.in, beautifulnara.com, bollywoodtadka.in, cakecentral.com, cari.com.my, chennaimemes.in, chickmania.com, cnnturk.com.tr, com.kmk.vidio, com.vidio.android, com.vidio.android.tv, creatoroy.com, ctvnest.com, ctvnest.com, dhirenvaghani.com, dhirenvaghani.com, dhirenvaghani.com, ek21.com, englishnotes.com, englishsummary.com, epicpixelplay.com, fazbro.com, funsoltech.com, gamingdayone.com, gazetevatan.com.tr, geometriaeducativa.xyz, grandideaintl.com, hanjukankan.com, horizonnesty.com, https://www.wynk.in, innoblazes.com, jiocinema.com, kaidee.com, kaidee.com, kavyadigital.store, kites.vn, kwongwah.com.my, liferead.in, linenesty.com, luftika.rs, majoriti.com.my, messagecube.mobi, miniclip.com, momspresso.com, mxplayer.in, mz-mz.net, news.seehua.com, nhattao.com, nw.wartaekonomi.co.id, odia.krishijagran.com, omnitalk.com, ondemandchina.com, ondemandviet.com, pinoyexchange.com, playducky.com, playverses.com, rayolesoftware.com, rayolesoftware.com, rayolesoftware.com, rojakdaily.com, seehua.com, sportsbrief.com, strm, swiftnesty.com, talentbridgess.com, tamil.krishijagran.com, team-bhp.com, techglidess.com, techyreviewx.com, topicanswers.com, trabajosmejores.com, udayavani.com, vitalprouts.com, www.dappei.net, yen.com, zonadetrabajo.net
