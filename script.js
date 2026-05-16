const gs = {
  playerName:'',playerAge:0,playerGrade:'',
  currentWeek:1,currentDay:1,
  money:0,weeklyAllowance:0,
  energy:10,health:10,friendship:10,family:10,grades:85,stress:3,
  totalSpent:0,
};

const gradeConfig = {
  'elem-lower':{weeklyAllowance:50, duration:2,label:'Grade 4-5'},
  'elem-upper':{weeklyAllowance:75, duration:3,label:'Grade 6'},
  'jhs-lower': {weeklyAllowance:100,duration:4,label:'Grade 7-8'},
  'jhs-upper': {weeklyAllowance:150,duration:4,label:'Grade 9-10'},
  'shs':       {weeklyAllowance:200,duration:4,label:'Grade 11-12'},
  'college-1': {weeklyAllowance:500,duration:4,label:'1st Year College'},
  'college-2': {weeklyAllowance:800,duration:4,label:'2nd-4th Year'},
};

const scenariosDB = {
  'elem-lower':[
    {loc:'Sa Kanto',title:'Tindahan ng Candy!',
     text:'May bagong gulaman sa tindahan ni Aling Rosa — ₱10 lang. Grabe ang tukso!',
     choices:[
      {text:'Bilhin ang gulaman (−₱10)',cost:10,impact:{energy:1,stress:-1},type:'positive',feedback:'Masarap! Pero may nagastos ka na.'},
      {text:'Mag-tiis, magtipid',cost:0,impact:{stress:1},type:'neutral',feedback:'Mabuti! Natipid mo ang ₱10. Proud si Nanay!'},
    ]},
    {loc:'Sa Klase',title:'Birthday ni Bestie!',
     text:'Kaarawan ni Ate Mae bukas! Gusto mong bumili ng regalo. ₱30 ang paboritong panulat niya.',
     choices:[
      {text:'Bumili ng regalo (−₱30)',cost:30,impact:{friendship:2},type:'positive',feedback:'Si Ate Mae ay sobrang natuwa sa regalo mo!'},
      {text:'Gumawa ng hand-made card (libre!)',cost:0,impact:{friendship:1,family:1},type:'balance',feedback:'Malikhaing solusyon! Mas may pagmamahal pa talaga.'},
      {text:'Walang regalo — mahal kasi',cost:0,impact:{friendship:-2},type:'negative',feedback:'Medyo nalungkot si Ate Mae. Sana next time!'},
    ]},
    {loc:'Sa Canteen',title:'Gutom na!',
     text:'Recess na, gutom ka na. May baon ka pero amoy masarap ang lugaw ng canteen — ₱20.',
     choices:[
      {text:'Bili ng lugaw (−₱20)',cost:20,impact:{energy:2,health:1},type:'positive',feedback:'Sarap talaga! Pero naubos na ang malaki.'},
      {text:'Kainin na lang ang baon',cost:0,impact:{energy:1,health:1,family:1},type:'neutral',feedback:'Mabuti! Masustansya pa ang baon ni Nanay.'},
    ]},
    {loc:'Sa Bahay',title:'Nanay Kailangan Tulong',
     text:'Nanay: "Anak, may ₱10 ka ba? Kulang ako para sa toyo." Paano mo siya tutulungan?',
     choices:[
      {text:'Ibigay ang ₱10 (−₱10)',cost:10,impact:{family:3},type:'positive',feedback:'Napakabait mo! Sobrang proud si Nanay sa iyo.'},
      {text:'Sabihing wala kahit may pera',cost:0,impact:{family:-2,stress:2},type:'negative',feedback:'Nahiya ka ba? Okay lang tulungan ang pamilya.'},
    ]},
    {loc:'Sa Paaralan',title:'School Fair!',
     text:'May peryahan sa paaralan ngayong Biyernes! Maraming laro at pagkain. Budget: ₱30.',
     choices:[
      {text:'Mag-enjoy sa fair (−₱30)',cost:30,impact:{friendship:2,stress:-2},type:'positive',feedback:'Ang saya-saya! Buhay estudyante talaga ito!'},
      {text:'Manood lang, hindi sumali',cost:0,impact:{stress:1},type:'neutral',feedback:'Natipid ka pero parang malungkot ka rin.'},
    ]},
    {loc:'Sa Arcade',title:'Bagong Laro sa Mall!',
     text:'May bagong dance machine sa mall! Kaklase mo ay nag-iimbita. ₱15 per game.',
     choices:[
      {text:'Maglaro isang round (−₱15)',cost:15,impact:{energy:2,stress:-2,friendship:1},type:'positive',feedback:'Grabe ang saya! Pawis ka pa!'},
      {text:'Manood lang ng laro ng iba',cost:0,impact:{friendship:1},type:'neutral',feedback:'Nakita mo rin naman at nakalibang ka.'},
    ]},
  ],

  'elem-upper':[
    {loc:'Sa Jeepney',title:'Pamasahe Papunta School',
     text:'Kailangan ng pamasahe papunta sa school. Jeepney = ₱15. Maglalakad ka ba?',
     choices:[
      {text:'Sakay ng jeepney (−₱15)',cost:15,impact:{energy:1},type:'neutral',feedback:'Komportable at nakarating ka agad.'},
      {text:'Maglakad para makatipid',cost:0,impact:{energy:-1,health:1},type:'balance',feedback:'Natipid ka pero pagod na pag-dating mo.'},
    ]},
    {loc:'Sa Bookstore',title:'School Project Kailangan',
     text:'Kailangan ng poster board at marker para sa Science project. Total: ₱40.',
     choices:[
      {text:'Bilhin lahat (−₱40)',cost:40,impact:{grades:3},type:'positive',feedback:'Maganda ang project mo! Ipinagmalaki ka ng teacher.'},
      {text:'Gumamit ng lumang cardboard (−₱5)',cost:5,impact:{grades:1,family:1},type:'balance',feedback:'Creative recycling! Nag-appreciate pa ang teacher.'},
      {text:'Hiram sa kaklase, walang gastos',cost:0,impact:{friendship:-1},type:'neutral',feedback:'Natipid ka pero medyo naiinis ang hiniram mo.'},
    ]},
    {loc:'Sa Sari-Sari Store',title:'Mainit na Panahon',
     text:'Sobrang init ngayon! Ang buko juice ni Mang Ben ay ₱20. Tubig lang din okay.',
     choices:[
      {text:'Bumili ng buko juice (−₱20)',cost:20,impact:{energy:2,health:1,stress:-1},type:'positive',feedback:'Ahh refreshing! Para kang nabuhay muli.'},
      {text:'Uminom ng tubig lang mula gripo',cost:0,impact:{energy:1},type:'neutral',feedback:'Okay din naman. Libre pa!'},
    ]},
    {loc:'Sa Klase',title:'Kontribusyon para sa Birthday Cake',
     text:'May kaarawan si Teacher. Nag-iipon ang klase ng ₱50 bawat isa para sa cake.',
     choices:[
      {text:'Mag-ambag ng ₱50 (−₱50)',cost:50,impact:{friendship:2},type:'positive',feedback:'Masaya ang buong klase! Napakabait mong estudyante.'},
      {text:'Sabihing wala (kahit may pera)',cost:0,impact:{friendship:-2,stress:1},type:'negative',feedback:'Alam ng mga kaklase mo... medyo naiwan ka.'},
      {text:'Mag-ambag ng ₱25 lang (−₱25)',cost:25,impact:{friendship:1},type:'balance',feedback:'Okay din! Hindi ka nag-iwan ng kaklase mo.'},
    ]},
    {loc:'Sa Bahay',title:'Lola May Lagnat',
     text:'Lola ay may mataas na lagnat. Kailangan ng gamot — ₱35. Ikaw ang pinakamalapit.',
     choices:[
      {text:'Ibigay ang pera para sa gamot (−₱35)',cost:35,impact:{family:3,health:1},type:'positive',feedback:'Nagpasalamat si Lola nang husto. Mahal ka niya.'},
      {text:'Sabihing wala',cost:0,impact:{family:-3,stress:2},type:'negative',feedback:'Nasaktan ang puso ng Lola mo. Ingatan ang pamilya.'},
    ]},
    {loc:'Sa Mall',title:'Barkada Outing!',
     text:'Mga kaibigan mo ay nagpaplano na pumunta sa mall pagkatapos ng klase. Budget: ₱50.',
     choices:[
      {text:'Sumama at mag-enjoy (−₱50)',cost:50,impact:{friendship:2,stress:-2},type:'positive',feedback:'Ang masaya ng samahan! Memories for life.'},
      {text:'Mag-decline, may exam bukas',cost:0,impact:{friendship:-1,grades:1},type:'balance',feedback:'Matalino ka! Inuna mo ang exam. Susunod na lang.'},
      {text:'Sumama pero hindi bumili (libre!)',cost:0,impact:{friendship:1,stress:-1},type:'neutral',feedback:'Nag-window shopping ka lang. Masaya pa rin!'},
    ]},
    {loc:'Sa Paaralan',title:'Lolo Bisita mula Probinsya!',
     text:'Dumating si Lolo mula Batangas! Gusto niya kang dalhin sa merienda. Kailangan mo ng ₱60.',
     choices:[
      {text:'Sumama sa merienda (−₱60)',cost:60,impact:{family:3,stress:-1},type:'positive',feedback:'Sobrang saya ni Lolo! Kwento ng kwento kayo hanggang gabi.'},
      {text:'Homework muna — susunod na lang',cost:0,impact:{family:-2,grades:1},type:'negative',feedback:'Naiintindihan ni Lolo pero medyo nalungkot siya.'},
    ]},
  ],

  'jhs-lower':[
    {loc:'Sa Kalsada',title:'Jeepney o Lakad?',
     text:'Malayo ang school. Jeepney = ₱15. Maglalakad ka ba kahit 30 minuto ang layo?',
     choices:[
      {text:'Sakay ng jeepney (−₱15)',cost:15,impact:{energy:1},type:'neutral',feedback:'Nakarating ka nang maayos at fresh.'},
      {text:'Maglakad para makatipid',cost:0,impact:{energy:-1,stress:1},type:'negative',feedback:'Natipid pero pagod at pawis pagdating.'},
      {text:'Maglakad at kumain ng mura (−₱5)',cost:5,impact:{energy:1},type:'balance',feedback:'Compromise! Nalakad mo na, natugunan pa ang gutom.'},
    ]},
    {loc:'Sa Canteen',title:'Tanghalian na!',
     text:'Nagtatanghali na. Tatlong pagpipilian ang naghihintay sa iyo...',
     choices:[
      {text:'Canteen meal (−₱45)',cost:45,impact:{energy:2,health:1},type:'positive',feedback:'Masustansya at masarap! Ready ka na sa hapon.'},
      {text:'Kainin ang baon mula bahay',cost:0,impact:{energy:1,health:1,family:1},type:'neutral',feedback:'Mabuti! Natuwa si Nanay na kinain mo ang baon.'},
      {text:'Jollibee kasama friends (−₱70)',cost:70,impact:{energy:2,friendship:2,stress:-1},type:'positive',feedback:'Masaya! Pero malaki ang nagastos. Worth it ba?'},
    ]},
    {loc:'Sa Classroom',title:'Group Project — Walang Pera ang Grupo',
     text:'Kailangan ng poster board at markers para sa group project. ₱60 total. Ikaw lang ang may pera sa grupo.',
     choices:[
      {text:'Bilhin lahat ikaw lang (−₱60)',cost:60,impact:{grades:2,stress:2,friendship:1},type:'positive',feedback:'Maganda ang project! Pero nagastos ka ng malaki para sa lahat.'},
      {text:'Sabihin sa grupo na maghanap din sila',cost:0,impact:{grades:-2},type:'negative',feedback:'Hindi natuloy ang project. Nakita ng teacher ang walang effort.'},
      {text:'Bayaran ang kalahati (−₱30)',cost:30,impact:{grades:1},type:'balance',feedback:'Fair enough. Nagsumikap kayong lahat kahit konti.'},
    ]},
    {loc:'Sa 7-Eleven',title:'Barkada Milk Tea Session!',
     text:'"Tara na ng milk tea!" sabi ng tropa. ₱50 bawat isa. Sasama ka ba?',
     choices:[
      {text:'Pumunta at mag-order (−₱50)',cost:50,impact:{friendship:2,stress:-2},type:'positive',feedback:'Sarap ng bonding time! Hindi mapapalitan ang ganitong sandali.'},
      {text:'Sabihing mahal, hindi muna',cost:0,impact:{friendship:-1,stress:1},type:'negative',feedback:'Naiintindihan nila pero nag-iwi ng kaunti.'},
      {text:'Suggest sari-sari store nalang (−₱15)',cost:15,impact:{friendship:1,stress:-1},type:'balance',feedback:'Matalino! Budget-friendly pero nag-enjoy pa rin kayo.'},
    ]},
    {loc:'Sa Bahay',title:'Emergency — Lagnat ni Nanay',
     text:'Lagnat si Nanay. Kailangan ng Biogesic at Gatorade. ₱80 lahat.',
     choices:[
      {text:'Bilhin ang gamot (−₱80)',cost:80,impact:{family:3,health:1},type:'positive',feedback:'Inaalagaan mo ang pamilya. Magaling na si Nanay.'},
      {text:'Sabihing wala',cost:0,impact:{family:-3,stress:2},type:'negative',feedback:'Nasaktan ang puso ni Nanay. Sana may paraan ka.'},
    ]},
    {loc:'Sa Paaralan',title:'Field Trip sa Museum!',
     text:'May field trip sa National Museum! ₱100 ang bayad kasama na ang almusal.',
     choices:[
      {text:'Sumali sa field trip (−₱100)',cost:100,impact:{grades:2,friendship:2,stress:-1},type:'positive',feedback:'Napakaraming natutunan mo! Pinakamahusay na araw ng school year.'},
      {text:'Skip — mahal, mag-aral nalang',cost:0,impact:{stress:1,grades:1},type:'negative',feedback:'Natipid ka pero hindi mo nakasama ang klase. FOMO…'},
    ]},
    {loc:'Sa Bahay',title:'Lolo mula Batangas!',
     text:'Dumating si Lolo! Gustong dalhin ka sa Mang Inasal para merienda. Kailangan mo ng ₱80.',
     choices:[
      {text:'Sumama sa Mang Inasal (−₱80)',cost:80,impact:{family:3,energy:2,stress:-1},type:'positive',feedback:'Walang katumbas ang oras kasama ang Lolo. At libre pa ang kanin!'},
      {text:'Hindi makasama — may homework',cost:0,impact:{family:-2,grades:1},type:'balance',feedback:'Naiintindihan ni Lolo pero pasado na siya sa probinsya bukas.'},
    ]},
    {loc:'Sa Klase',title:'Kontribusyon sa Birthday Party',
     text:'Kaarawan ng kaklase. Nag-iipon ang klase ng ₱50 para sa cake at regalo.',
     choices:[
      {text:'Mag-ambag ng ₱50 (−₱50)',cost:50,impact:{friendship:2},type:'positive',feedback:'Masaya ang celebration! Nagpasalamat sa iyo ang lahat.'},
      {text:'Pasahan nalang — walang pera',cost:0,impact:{friendship:-1},type:'negative',feedback:'Alam ng lahat na may pera ka kanina…'},
      {text:'Mag-ambag ng ₱25 lang (−₱25)',cost:25,impact:{friendship:1},type:'balance',feedback:'Okay din! Hindi ka nag-iwan ng barkada.'},
    ]},
  ],

  'jhs-upper':[
    {loc:'Sa Kalsada',title:'Umuulan — Jeepney na!',
     text:'Umuulan ng malakas! Jeepney = ₱20. Maglalakad ka ba at mabasa?',
     choices:[
      {text:'Sakay ng jeepney (−₱20)',cost:20,impact:{health:1,stress:-1},type:'neutral',feedback:'Mabuting desisyon. Nakarating ka nang tuyo.'},
      {text:'Maglakad kahit ulan',cost:0,impact:{health:-2,energy:-1,stress:2},type:'negative',feedback:'Nabasa ka. Lagnat ka bukas. Hindi sulit ang ₱20.'},
    ]},
    {loc:'Sa Canteen',title:'Lunch Date?',
     text:'Nag-iimbita ang crush mo na kumain ng tanghalian kasama. Jollibee = ₱70.',
     choices:[
      {text:'Sumama sa Jollibee (−₱70)',cost:70,impact:{friendship:2,stress:-2},type:'positive',feedback:'Kilig! Maganda ang tanghalian. Smile ka nang smile!'},
      {text:'Canteen nalang (−₱45)',cost:45,impact:{energy:1},type:'neutral',feedback:'Komportable at nakakain ka nang maayos.'},
      {text:'Kainin na lang ang baon (libre!)',cost:0,impact:{energy:1,family:1},type:'balance',feedback:'Natipid pero parang nawala ang chance. Baka susunod na lang?'},
    ]},
    {loc:'Sa Classroom',title:'Project Lead — Bayaran Muna',
     text:'Ikaw ang group leader. Kailangan ng materials ngayon — ₱80. I-reimburse ng grupo later.',
     choices:[
      {text:'Bilhin na ngayon (−₱80)',cost:80,impact:{grades:3,stress:2,friendship:1},type:'positive',feedback:'Napakagaling na leader! Pero wag mong kalimutang hingiin ang bayad.'},
      {text:'Sabihin sa grupo na silang bumili',cost:0,impact:{grades:-2,stress:1},type:'negative',feedback:'Walang nagbili. Walang materials. Palpak ang project.'},
    ]},
    {loc:'Sa Gaming Café',title:'Tournament! Tara na!',
     text:'"May tournament sa gaming café! Tara na!" Dalawang oras = ₱120.',
     choices:[
      {text:'Full 2 hours (−₱120)',cost:120,impact:{friendship:2,stress:-3},type:'positive',feedback:'Nanalo pa kayo sa tournament! Epic!'},
      {text:'1 oras lang (−₱60)',cost:60,impact:{friendship:1,stress:-2},type:'balance',feedback:'Bahagyang nag-enjoy, nakatipid din ng konti.'},
      {text:'Skip, may exam bukas',cost:0,impact:{grades:2,friendship:-2,stress:1},type:'negative',feedback:'Mabuting desisyon para sa exam. Pero FOMO ka buong gabi.'},
    ]},
    {loc:'Sa Cinema',title:'Movie Date!',
     text:'Crush mo: "Gusto mo ng movie this Saturday?" Ticket + popcorn = ₱150.',
     choices:[
      {text:'Go! Kilig mode on (−₱150)',cost:150,impact:{stress:-3,friendship:2,grades:-1},type:'positive',feedback:'Napakasaya! Pinakamasayang Sabado ng buhay mo.'},
      {text:'Mag-suggest ng libre — park date',cost:0,impact:{friendship:1,stress:-1},type:'balance',feedback:'Romantic pa nga! Mas meaningful kaysa cinema.'},
      {text:'Busy daw — nagsisinungaling',cost:0,impact:{stress:2,friendship:-1},type:'negative',feedback:'Nawala ang pagkakataon. Sana nag-go ka na lang.'},
    ]},
    {loc:'Sa Botika',title:'May Ubo at Sipon',
     text:'Tatlong araw ka nang may ubo at sipon. Kailangan ng gamot — ₱80.',
     choices:[
      {text:'Bumili ng gamot (−₱80)',cost:80,impact:{health:3,energy:2},type:'positive',feedback:'Gumaling ka agad! Importante ang kalusugan.'},
      {text:'Tibay lang — madadaan din ito',cost:0,impact:{health:-2,energy:-2,stress:1},type:'negative',feedback:'Lumala ang sakit mo. Lumiban ka ng tatlong araw sa school.'},
    ]},
    {loc:'Sa Bahay',title:'Kuryente Bill — Emergency',
     text:'Nanay: "Anak, kulang kami sa bayad ng kuryente. ₱50 lang, kahit pati kita." Tutulong ka?',
     choices:[
      {text:'Ibigay ang ₱50 (−₱50)',cost:50,impact:{family:3,stress:1},type:'positive',feedback:'Napakabait mong anak! Naiyak pa si Nanay sa pasasalamat.'},
      {text:'Sabihing wala',cost:0,impact:{family:-2,stress:2},type:'negative',feedback:'Naiintindihan ni Nanay pero medyo nasugatan ang puso niya.'},
    ]},
    {loc:'Sa Mall',title:'Videoke Night — Tara na!',
     text:'"Tara videoke! ₱100 bawat isa, libre ang drinks." Kasama ang buong barkada.',
     choices:[
      {text:'Sumama! (−₱100)',cost:100,impact:{friendship:2,stress:-2},type:'positive',feedback:'Ito ang buhay! LOUDEST ang grupo ninyo sa buong mall.'},
      {text:'Hindi muna — mahal',cost:0,impact:{friendship:-1,stress:1},type:'negative',feedback:'Naiintindihan nila. Pero maingay sa group chat ang kulit nila.'},
    ]},
  ],

  'shs':[
    {loc:'Sa Kalsada',title:'Araw-Araw na Pamasahe',
     text:'Jeepney papunta school — ₱20 isang paraan, ₱40 pabalik-balik. Budget mo ngayon?',
     choices:[
      {text:'Bayad ng buo (−₱40)',cost:40,impact:{energy:1},type:'neutral',feedback:'Komportable ang biyahe. Pag-isipan ang weekly transport budget.'},
      {text:'Maglakad pauwi, jeepney papunta (−₱20)',cost:20,impact:{energy:-1,health:1},type:'balance',feedback:'Natipid ng kalahati at exercise pa!'},
    ]},
    {loc:'Sa Fastfood',title:'Tanghalian Ngayon',
     text:'Saan ka kakain ngayon? Tatlong pagpipilian ang naghihintay...',
     choices:[
      {text:'Jollibee (−₱60)',cost:60,impact:{energy:2,stress:-1},type:'positive',feedback:'Masarap! Pero regular na gastos ito.'},
      {text:'School canteen (−₱40)',cost:40,impact:{energy:1},type:'neutral',feedback:'Praktikal at malapit. Nakatipid ka ng ₱20.'},
      {text:'Baon mula bahay (libre!)',cost:0,impact:{energy:1,health:1,family:1},type:'balance',feedback:'Best choice! Masustansya, libre, at natuwa pa si Nanay.'},
    ]},
    {loc:'Sa Cinema',title:'Movie + Date Night',
     text:'Crush mo: "Libre mo ako ng movie?" Cinema + popcorn = ₱200.',
     choices:[
      {text:'Go — libre pa crush (−₱200)',cost:200,impact:{stress:-3,friendship:3,grades:-1},type:'positive',feedback:'KILIG! Hindi ka makatulog sa gabi sa saya.'},
      {text:'Suggest picnic date nalang (−₱80)',cost:80,impact:{stress:-2,friendship:2},type:'balance',feedback:'Creative at matipid! Mas romantic pa nga.'},
      {text:'Sabihing busy',cost:0,impact:{stress:1,friendship:-1},type:'negative',feedback:'Naiintindihan ng crush pero obvious na hindi ka game.'},
    ]},
    {loc:'Online',title:'Tutoring Job Opportunity!',
     text:'May tutoring gig! ₱200 per 2-hour session para turuan ang kapatid ng kaklase mo.',
     choices:[
      {text:'Tanggapin ang gig (+₱200 earned!)',cost:-200,impact:{stress:2,energy:-1,grades:1},type:'positive',feedback:'Kumita ka! ₱200 extra! Pero pagod ka rin nang konti.'},
      {text:'Decline — focus sa sariling aral',cost:0,impact:{grades:1,stress:-1},type:'neutral',feedback:'Maayos. Inuna mo ang sarili mong pag-aaral.'},
    ]},
    {loc:'Sa Klinika',title:'Lagnat + Ubo — Grabe na',
     text:'Tatlong araw nang masakit. Doctor + gamot = ₱150. Pupunta ka ba?',
     choices:[
      {text:'Pumunta sa doktor (−₱150)',cost:150,impact:{health:3,energy:2,stress:-1},type:'positive',feedback:'Gumaling ka agad! Ang kalusugan ay kayamanan.'},
      {text:'Bumili lang ng gamot (−₱70)',cost:70,impact:{health:2},type:'balance',feedback:'Okay din. Gumaling ka rin pero mas matagal.'},
      {text:'Tibay lang — madadaan',cost:0,impact:{health:-3,energy:-2,stress:2,grades:-2},type:'negative',feedback:'Lumiban ka ng isang linggo. Mahirapan sa make-up exams.'},
    ]},
    {loc:'Sa Bahay',title:'Family Emergency — Dad Nagpadala',
     text:'Dad: "Anak, may emergency. Kailangan ng ₱500. Makatulong ka kahit konti?"',
     choices:[
      {text:'Ibigay lahat ng mayroon (−₱500)',cost:500,impact:{family:3,stress:2},type:'positive',feedback:'Kahit kulang ka na, buo ang pagmamahal mo sa pamilya.'},
      {text:'Ibigay ang kalahati (−₱250)',cost:250,impact:{family:2,stress:1},type:'balance',feedback:'May naibigay ka. Hindi 100% pero nandoon ka para sa kanila.'},
      {text:'Wala kang maibigay',cost:0,impact:{family:-3,stress:2},type:'negative',feedback:'Nasaktan ang puso ng Dad. Kahit konti, may malaking kahulugan.'},
    ]},
    {loc:'Sa Gaming Café',title:'Tournament Weekend!',
     text:'Gaming café tournament ngayong weekend. 2 oras = ₱100. Marami nang sumali sa barkada.',
     choices:[
      {text:'Full session! (−₱100)',cost:100,impact:{friendship:2,stress:-3},type:'positive',feedback:'CHAMPION ang grupo ninyo! Legendary ang gabi na iyon.'},
      {text:'30 minuto lang (−₱50)',cost:50,impact:{friendship:1,stress:-1},type:'balance',feedback:'Bahagyang naglaro. Nakatipid at nag-enjoy pa rin.'},
      {text:'Skip — may project',cost:0,impact:{friendship:-1,grades:2},type:'neutral',feedback:'Mabuting desisyon para sa project. Baka susunod na tournament.'},
    ]},
    {loc:'Sa School',title:'Review Center o Mag-self Study?',
     text:'May review session ang kaklase mo sa review center. ₱300 bawat session.',
     choices:[
      {text:'Mag-enroll sa review (−₱300)',cost:300,impact:{grades:3,stress:2},type:'positive',feedback:'Malaki ang natuto mo! Pumasok ang lahat ng exam tips.'},
      {text:'Self-study gamit YouTube',cost:0,impact:{grades:1},type:'balance',feedback:'Sapat din! May libre pang mga resources online.'},
    ]},
  ],

  'college-1':[
    {loc:'Sa Dorm',title:'Bayad sa Kuryente — Roommate',
     text:'Roommate: "Pre, ₱300 ang share mo sa electric bill. Bukas na ang deadline."',
     choices:[
      {text:'Bayaran ngayon (−₱300)',cost:300,impact:{stress:1,friendship:1},type:'positive',feedback:'Responsable kang roommate! Hindi ka makakalimutan niya iyan.'},
      {text:'Sabihing susunod nalang',cost:0,impact:{stress:2,friendship:-2},type:'negative',feedback:'Naiinis na ang roommate mo. Huwag gawing ugali ito.'},
    ]},
    {loc:'Sa Grocery',title:'Weekly Groceries',
     text:'Kailangan ng pagkain para sa buong linggo. Dalawang pagpipilian...',
     choices:[
      {text:'Tamang groceries (−₱200)',cost:200,impact:{energy:2,health:2,stress:-1},type:'positive',feedback:'Smart! Mas mura at mas masustansya kaysa kain sa labas araw-araw.'},
      {text:'Kain sa labas araw-araw (−₱350)',cost:350,impact:{energy:1,stress:1},type:'negative',feedback:'Masarap pero grabe ang nagastos. ₱150 extra na nagastos.'},
    ]},
    {loc:'Sa Restaurant',title:'Dinner Date sa SO',
     text:'SO: "Tara na dinner date?" Budget sa resto: ₱300.',
     choices:[
      {text:'Go! Dinner date (−₱300)',cost:300,impact:{stress:-3,friendship:3},type:'positive',feedback:'Perpektong gabi. Worth every peso.'},
      {text:'Suggest dorm-cooked dinner (−₱50)',cost:50,impact:{stress:-2,friendship:2},type:'balance',feedback:'MAS ROMANTIC! Luto kayo ng luto sa dorm. Iconic.'},
      {text:'Busy ngayon — ulit na lang',cost:0,impact:{stress:1,friendship:-2},type:'negative',feedback:'Disappointed ang SO. Balanse ang pag-aaral at relasyon.'},
    ]},
    {loc:'Sa Bookstore',title:'Textbooks — Required ba?',
     text:'Textbooks para sa 3 subjects: ₱500 average. Lahat required ayon sa syllabus.',
     choices:[
      {text:'Bilhin lahat (−₱500)',cost:500,impact:{grades:3,stress:-1},type:'positive',feedback:'Handa ka sa lahat ng klase! Investment ito sa grades mo.'},
      {text:'Share sa kaklase (−₱100)',cost:100,impact:{grades:1,friendship:1},type:'balance',feedback:'Matipid at team player! Pero laging maaga para makuha ang libro.'},
      {text:'I-photocopy ang kailangan (−₱50)',cost:50,impact:{grades:0,stress:1},type:'balance',feedback:'Okay lang sa ngayon pero inconvenient kapag malaki ang assignments.'},
    ]},
    {loc:'Sa Clinic',title:'Hindi Maganda ang Pakiramdam',
     text:'Lagnat at sakit ng ulo nang dalawang araw. Clinic visit = ₱200.',
     choices:[
      {text:'Pumunta sa clinic (−₱200)',cost:200,impact:{health:3,energy:1},type:'positive',feedback:'Gumaling ka agad. Huwag ipagpaliban ang kalusugan.'},
      {text:'Magpahinga lang sa dorm',cost:0,impact:{health:1,stress:-1},type:'neutral',feedback:'Okay din kung banayad lang. Pero subaybayan ang kondisyon mo.'},
    ]},
    {loc:'Online',title:'Part-Time Tutoring Job!',
     text:'May tutoring gig: ₱300 per 3-hour session. Puwede isang beses sa linggo.',
     choices:[
      {text:'Tanggapin ang gig (+₱300 earned!)',cost:-300,impact:{stress:2,energy:-2},type:'positive',feedback:'Kumita ka ng sarili mong pera! Pero bantayan ang energy mo.'},
      {text:'Mag-focus sa pag-aaral muna',cost:0,impact:{grades:2,stress:-1},type:'neutral',feedback:'Maayos na desisyon. Inuna mo ang studies.'},
    ]},
    {loc:'Sa School',title:'Group Project — Ikaw Muli',
     text:'Materials para sa final project: ₱150. Karamihan sa grupo ay hindi makapag-ambag.',
     choices:[
      {text:'Bayaran lahat ikaw (−₱150)',cost:150,impact:{grades:2,stress:2,friendship:1},type:'positive',feedback:'Maganda ang project! Pero discuss sa grupo ang fairness.'},
      {text:'Fair split — ₱50 ka lang (−₱50)',cost:50,impact:{grades:1},type:'balance',feedback:'Tama! Lahat may responsibilidad sa grupo.'},
    ]},
    {loc:'Sa School',title:'Thesis / Capstone Expenses',
     text:'Printing ng thesis chapters + materials = ₱400 ngayong buwan.',
     choices:[
      {text:'Full budget para sa thesis (−₱400)',cost:400,impact:{grades:3,stress:2},type:'positive',feedback:'Handa ang thesis! Maliwanag ang kinabukasan mo.'},
      {text:'Minimum expenses lang (−₱150)',cost:150,impact:{grades:1,stress:1},type:'balance',feedback:'Nakatipid ka pero may mga bagay na kulang. Kumpletuhin mo rin.'},
    ]},
  ],
};

scenariosDB['college-2'] = scenariosDB['college-1'];

// ─── SCREENS ───────────────────────────────────────────────
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

// ─── TOAST ─────────────────────────────────────────────────
let toastTimer;
function showToast(msg,type='tip'){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast show '+type;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.className='toast',2800);
}

// ─── SETUP ─────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click',()=>{
  const name=document.getElementById('playerName').value.trim();
  const age=document.getElementById('playerAge').value;
  const grade=document.getElementById('playerGrade').value;
  if(!name){showToast('Ilagay mo ang iyong pangalan!','bad');return;}
  if(!age){showToast('Ilagay mo ang iyong edad!','bad');return;}
  if(!grade){showToast('Piliin mo ang iyong grade!','bad');return;}
  gs.playerName=name;gs.playerAge=parseInt(age);gs.playerGrade=grade;
  const cfg=gradeConfig[grade];
  gs.weeklyAllowance=cfg.weeklyAllowance;gs.money=cfg.weeklyAllowance;
  document.getElementById('displayName').textContent=name;
  document.getElementById('weekTotal').textContent=cfg.duration;
  document.getElementById('allowanceDisplay').textContent='₱'+cfg.weeklyAllowance+' / linggo';
  updateUI();loadScenario();showScreen('gameScreen');
});

// ─── SCENARIO ──────────────────────────────────────────────
let usedIdx=[];
function loadScenario(){
  const pool=scenariosDB[gs.playerGrade]||scenariosDB['jhs-lower'];
  if(usedIdx.length>=pool.length)usedIdx=[];
  let i;
  do{i=Math.floor(Math.random()*pool.length);}
  while(usedIdx.includes(i)&&usedIdx.length<pool.length);
  usedIdx.push(i);
  displayScenario(pool[i]);
}

function displayScenario(sc){
  document.getElementById('scenLoc').textContent=sc.loc||'Sa Paaralan';
  document.getElementById('scenTitle').textContent=sc.title;
  document.getElementById('scenText').textContent=sc.text;
  const panel=document.getElementById('choicesPanel');panel.innerHTML='';
  sc.choices.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='choice-btn '+ch.type;btn.textContent=ch.text;
    btn.onclick=()=>makeChoice(ch);panel.appendChild(btn);
  });
}

// ─── CHOICE ────────────────────────────────────────────────
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function makeChoice(ch){
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  gs.money+=-(ch.cost);
  if(ch.cost>0)gs.totalSpent+=ch.cost;
  const im=ch.impact;
  gs.energy    =clamp(gs.energy    +(im.energy    ||0),0,10);
  gs.health    =clamp(gs.health    +(im.health    ||0),0,10);
  gs.friendship=clamp(gs.friendship+(im.friendship||0),0,10);
  gs.family    =clamp(gs.family    +(im.family    ||0),0,10);
  gs.grades    =clamp(gs.grades    +(im.grades    ||0),0,100);
  gs.stress    =clamp(gs.stress    +(im.stress    ||0),0,10);
  const tt=ch.type==='positive'?'ok':ch.type==='negative'?'bad':'tip';
  showToast(ch.feedback||'',tt);
  gs.currentDay++;
  if(gs.currentDay>7){
    gs.currentDay=1;gs.currentWeek++;
    gs.money+=gs.weeklyAllowance;
    const dur=gradeConfig[gs.playerGrade].duration;
    if(gs.currentWeek<=dur)setTimeout(()=>showToast('✅ Bagong Linggo! +₱'+gs.weeklyAllowance+' allowance','ok'),500);
  }
  if(gs.money<0){gs.stress=clamp(gs.stress+1,0,10);gs.health=clamp(gs.health-1,0,10);}
  const duration=gradeConfig[gs.playerGrade].duration;
  if(gs.currentWeek>duration){setTimeout(endGame,900);return;}
  updateUI();setTimeout(loadScenario,350);
}

// ─── UI ────────────────────────────────────────────────────
function updateUI(){
  document.getElementById('weekNum').textContent=Math.min(gs.currentWeek,gradeConfig[gs.playerGrade].duration);
  document.getElementById('dayNum').textContent=gs.currentDay;
  const md=document.getElementById('moneyDisplay');
  md.textContent='₱'+gs.money;md.className='peso-big'+(gs.money<0?' critical':'');
  setStat('energy',gs.energy,10);setStat('health',gs.health,10);
  setStat('friendship',gs.friendship,10);setStat('family',gs.family,10);
  setStat('grades',gs.grades,100);setStat('stress',gs.stress,10);
  const dots=document.getElementById('dayDots');dots.innerHTML='';
  for(let i=1;i<=7;i++){const d=document.createElement('div');d.className='day-dot'+(i<gs.currentDay?' done':'');dots.appendChild(d);}
}
function setStat(n,v,max){
  document.getElementById('b-'+n).style.width=(v/max*100)+'%';
  document.getElementById('v-'+n).textContent=v+'/'+max;
}

// ─── END GAME ──────────────────────────────────────────────
function endGame(){
  const moneyScore =Math.max(0,gs.money)/gs.weeklyAllowance*20;
  const gradeScore =gs.grades*0.3;
  const statsScore =(gs.health+gs.friendship+gs.family+gs.energy)/40*30;
  const stressPen  =gs.stress*2;
  const finalNum   =clamp(Math.round(moneyScore+gradeScore+statsScore-stressPen),0,100);

  let title,sub,reflection,tips;
  if(finalNum>=85){
    title='🏆 KABOG NA KABOG!';sub='Ikaw ang tunay na Pinoy na matalino!';
    reflection='Napakahusay mo! Pinamamahalaan mo nang maayos ang allowance mo habang iniingatan ang pamilya, kaibigan, at sariling kalusugan. Maganda ang kinabukasan mo dahil alam mo nang maaga ang halaga ng pera at tamang desisyon.';
    tips=['Subukan ang saving challenge — ₱1 sa unang araw, ₱2 sa ikalawa, at iba pa','Ituloy ang ugaling mag-baon para makatipid','Huwag kalimutang mag-ambag sa pamilya kapag kaya mo'];
  }else if(finalNum>=65){
    title='👍 MAGALING!';sub='May magandang simula ka na!';
    reflection='Maayos ang ginawa mo! May mga desisyon kang pwedeng pagandahin pa, lalo na sa pag-iisip nang mas matagal bago gumastos. Keep it up at patuloy na matuto!';
    tips=['I-practice ang 24-hour rule — hintayin ng isang araw bago bumili ng hindi kinakailangan','Gumawa ng simpleng budget planner','I-track ang mga nagastos mo lingguhan'];
  }else if(finalNum>=40){
    title='⚠️ Kailangan ng Improvement';sub='Natuto ka ng mabuting aral ngayon.';
    reflection='Mahirap ang pamamahala ng pera, alam na alam mo na iyan ngayon! Maraming beses kang nahulog sa tukso ng pagpapakasaya nang hindi inisip ang bukas. Pero okay lang — ito ang layunin ng laro: matuto!';
    tips=['Una: bayaran muna ang kailangan, pagkatapos ang gusto','Huwag umutang maliban sa emergency','Mag-ipon kahit ₱5 o ₱10 sa bawat linggo'];
  }else{
    title='😬 Grabe ang Nangyari!';sub='Pag-aralan natin ang nangyari…';
    reflection='Maubos ang allowance bago matapos ang linggo — ito ang pinakamahal na aral ng laro. Sa totoong buhay, mas malala pa ang consequences. Pero ngayon mo pa lang natutunan ito — mas maaga, mas mabuti!';
    tips=['Gawa ng listahan ng kailangan vs gusto bago bumili','Pag-usapan ang budget sa magulang o guardian mo','Subukan muli ang laro at gamitin ang mga natutunan mo!'];
  }

  document.getElementById('resultTitle').textContent=title;
  document.getElementById('resultSub').textContent=sub;
  document.getElementById('finalGradeDisplay').textContent=finalNum+'%';
  document.getElementById('reflectionText').textContent=reflection;

  const grid=document.getElementById('resultGrid');
  [{label:'💰 Pera natitira',val:'₱'+gs.money},{label:'📚 Grades',val:gs.grades+'%'},
   {label:'❤️ Kalusugan',val:gs.health+'/10'},{label:'💕 Kaibigan',val:gs.friendship+'/10'},
   {label:'👨‍👩‍👧 Pamilya',val:gs.family+'/10'},{label:'😰 Stress',val:gs.stress+'/10'},
  ].forEach(s=>{
    const c=document.createElement('div');c.className='r-card';
    c.innerHTML='<div class="r-label">'+s.label+'</div><div class="r-val">'+s.val+'</div>';
    grid.appendChild(c);
  });

  document.getElementById('tipsList').innerHTML=tips.map(t=>'<li>'+t+'</li>').join('');
  showScreen('resultScreen');
}

showScreen('setupScreen');
