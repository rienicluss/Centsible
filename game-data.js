const gradeConfig = {
  'elem-lower':{weeklyAllowance:50, duration:2,label:'Grade 4-5'},
  'elem-upper':{weeklyAllowance:75, duration:3,label:'Grade 6'},
  'jhs-lower': {weeklyAllowance:100,duration:4,label:'Grade 7-8'},
  'jhs-upper': {weeklyAllowance:150,duration:4,label:'Grade 9-10'},
  'shs':       {weeklyAllowance:200,duration:4,label:'Grade 11-12'},
  'college-1': {weeklyAllowance:500,duration:4,label:'1st Year College'},
  'college-2': {weeklyAllowance:800,duration:4,label:'2nd-4th Year'},
};

// ─── BIG EVENTS (Extracurriculars, Projects, Activities) ─────
// These occur randomly during the 30 days and require money
// Player can pay, ask for parental advance, or skip (grades penalty)
const bigEvents = [
  {id:'event-research-project',title:'Research Project Due',desc:'Your research project is due. Need ₱30 for materials (printing, binding).',costScale:0.3,gradeImpact:2},
  {id:'event-club-shirt',title:'Science Club Shirt',desc:'The Science Club is selling limited-edition shirts for club events. ₱50.',costScale:0.5,gradeImpact:1,socialImpact:1},
  {id:'event-field-trip',title:'Field Trip Permission Slip',desc:'Exciting field trip tomorrow! But need to pay ₱80 for transportation and entrance fee.',costScale:0.8,gradeImpact:2,healthImpact:1},
  {id:'event-sports-fee',title:'Sports Club Registration',desc:'Basketball tournament next month. Registration fee: ₱60.',costScale:0.6,gradeImpact:1,healthImpact:1},
  {id:'event-art-supplies',title:'Art Supplies for Contest',desc:'School art contest this week. Need ₱40 for canvas and paints.',costScale:0.4,gradeImpact:2},
  {id:'event-tutoring',title:'Tutoring Session',desc:'Struggling in Math? Peer tutor charges ₱50 per session.',costScale:0.5,gradeImpact:2},
  {id:'event-photo-fee',title:'Class Photo Package',desc:'Class photos due. Package for digital copies and prints: ₱45.',costScale:0.45,socialImpact:1},
  {id:'event-debate-costume',title:'Debate Team Costume',desc:'You made the debate team! Need ₱75 for costume rental.',costScale:0.75,gradeImpact:1,stressImpact:-1},
];

// ─── UNIVERSAL SCENARIOS ────────────────────────────────────
// These scenarios happen to every student every month, regardless of grade.
// Costs are scaled at runtime based on the player's weeklyAllowance.
// Each scenario has a `costScale` — a fraction of weeklyAllowance — instead of a fixed cost.
// actual cost = Math.round(weeklyAllowance * costScale)

const universalScenarios = [

  // ── TRANSPORT (4) ────────────────────────────────────────────
  {
    id:'transport-rain',
    category:'transport',
    loc:'Sa Kalsada',
    title:'Umuulan — Sakay na ba?',
    text:'Umuulan nang malakas habang pauwi ka. Mahal ang jeepney ngayon, pero mababasa ka kung lalakad.',
    choices:[
      {text:'Sakay ng jeepney',costScale:0.15,impact:{health:1,stress:-1},type:'neutral',feedback:'Nakarating ka nang tuyo. Mabuting desisyon habang umuulan.'},
      {text:'Maglakad kahit ulan',costScale:0,impact:{health:-2,energy:-1,stress:2},type:'negative',feedback:'Nabasa ka. Baka magkalagnat ka bukas. Hindi sulit ang itipon.'},
    ]
  },
  {
    id:'transport-daily',
    category:'transport',
    loc:'Sa Kalsada',
    title:'Jeepney o Maglakad?',
    text:'Maliwanag naman ang panahon ngayon. Jeepney papunta school, pero 20 minuto lang naman ang layo.',
    choices:[
      {text:'Sakay ng jeepney',costScale:0.15,impact:{energy:1},type:'neutral',feedback:'Komportable at nakarating ka agad. Pag-isipan ang weekly transport budget.'},
      {text:'Maglakad para makatipid',costScale:0,impact:{energy:-1,health:1},type:'balance',feedback:'Natipid ka at exercise pa! Dalawang ibon, isang bato.'},
    ]
  },
  {
    id:'transport-late',
    category:'transport',
    loc:'Sa Kalsada',
    title:'Mahuhuli sa Klase!',
    text:'Gising ka nang huli. Kung mag-jeepney ka lang, siguradong late ka. May tricycle na mas mabilis pero mas mahal.',
    choices:[
      {text:'Tricycle para hindi mahuli',costScale:0.25,impact:{grades:1,stress:-1},type:'positive',feedback:'Nakarating ka sa oras. Minsan okay lang gumastos para hindi mahuli.'},
      {text:'Jeepney na lang, tanggap ang late',costScale:0.15,impact:{grades:-1,stress:1},type:'negative',feedback:'Natipid ka pero late ka pa rin. May deductions sa attendance.'},
      {text:'Tumakbo at lumakad nang mabilis',costScale:0,impact:{energy:-2,health:-1},type:'balance',feedback:'Nakarating ka — halos! Pagod ka nang husto bago pa magsimula ang klase.'},
    ]
  },
  {
    id:'transport-weekly-budget',
    category:'transport',
    loc:'Sa Bahay',
    title:'Pamasahe para sa Buong Linggo',
    text:'Simula ng linggo. Kailangan mong mag-plan ng pamasahe para sa 5 araw na pasok. Ilang araw mag-jeepney?',
    choices:[
      {text:'Jeepney araw-araw (5 araw)',costScale:0.75,impact:{energy:2,stress:-1},type:'neutral',feedback:'Komportable ang buong linggo pero mabigat sa budget. Plan mo ito next week.'},
      {text:'Jeepney 3 araw, lakad 2 araw',costScale:0.45,impact:{energy:0,health:1},type:'balance',feedback:'Magandang balance! Natipid ka at nakakuha pa ng exercise sa dalawang araw.'},
      {text:'Maglakad araw-araw para makatipid',costScale:0,impact:{energy:-2,health:2},type:'balance',feedback:'Malaking tipid! Pero sure kang mapapagod tuwing hapon. Sulit ba?'},
    ]
  },

  // ── FOOD (5) ─────────────────────────────────────────────────
  {
    id:'food-lunch',
    category:'food',
    loc:'Sa Canteen',
    title:'Tanghalian na!',
    text:'Gutom ka na. Tatlong pagpipilian ang naghihintay sa iyo...',
    choices:[
      {text:'Canteen meal',costScale:0.35,impact:{energy:2,health:1},type:'positive',feedback:'Masustansya at malapit. Praktikal na pagpipilian.'},
      {text:'Fastfood kasama friends',costScale:0.55,impact:{energy:2,friendship:2,stress:-1},type:'positive',feedback:'Masaya! Pero malaki ang nagastos kumpara sa canteen.'},
      {text:'Kainin na lang ang baon',costScale:0,impact:{energy:1,health:1,family:1},type:'balance',feedback:'Pinakamatalinong pagpipilian! Masustansya, libre, at natuwa pa si Nanay.'},
    ]
  },
  {
    id:'food-merienda',
    category:'food',
    loc:'Sa Sari-Sari Store',
    title:'Snack Attack!',
    text:'Gutom ka ng merienda. May tindahan sa tabi ng school.',
    choices:[
      {text:'Bumili ng snack',costScale:0.12,impact:{energy:1,stress:-1},type:'neutral',feedback:'Masarap! Pero regular na gastos ito linggu-linggo.'},
      {text:'Kainin na lang ang nasa bahay',costScale:0,impact:{energy:1,family:1},type:'balance',feedback:'Mabuti! Natipid at nag-appreciate si Nanay.'},
    ]
  },
  {
    id:'food-drinks',
    category:'food',
    loc:'Sa Labas ng School',
    title:'Mainit na Hapon — Inumin?',
    text:'Grabe ang init ngayong hapon. May drink stand sa labas ng school — juice, sago, milk tea. Mura-mura lang.',
    choices:[
      {text:'Bumili ng malamig na inumin',costScale:0.14,impact:{energy:1,stress:-1,health:1},type:'neutral',feedback:'Ahh, refreshing! Kailangan mo talaga lalo na sa ganitong init.'},
      {text:'Tubig lang mula sa gripo',costScale:0,impact:{energy:0},type:'balance',feedback:'Libre at okay naman. Hydrated ka pa rin naman.'},
    ]
  },
  {
    id:'food-baon-forgot',
    category:'food',
    loc:'Sa Paaralan',
    title:'Nakalimutang Magdala ng Baon!',
    text:'Pagdating mo sa school, naalala mo — naiwanan mo ang baon sa bahay. Wala kang pagkain para sa buong araw.',
    choices:[
      {text:'Bumili sa canteen',costScale:0.35,impact:{energy:2,health:1},type:'neutral',feedback:'Okay, nakaraos ka. Pero dagdag gastos ito na hindi nakaplano.'},
      {text:'Hiram ng pagkain sa kaibigan',costScale:0,impact:{friendship:1,energy:1},type:'balance',feedback:'Mabuting kaibigan! Bayaran mo rin siya bukas.'},
      {text:'Mag-tiis hanggang uwi',costScale:0,impact:{energy:-2,health:-1,grades:-1},type:'negative',feedback:'Gutom ka nang husto. Nahirapan kang mag-concentrate sa klase.'},
    ]
  },
  {
    id:'food-weekly-groceries',
    category:'food',
    loc:'Sa Palengke / Tindahan',
    title:'Pang-Linggo na Pagkain',
    text:'Halos ubos na ang pagkain sa bahay. Kailangan mag-grocery para sa susunod na ilang araw.',
    choices:[
      {text:'Mag-grocery ng maayos',costScale:0.8,impact:{energy:2,health:2,family:1},type:'positive',feedback:'Smart! Mas mura at mas masustansya kaysa kain sa labas araw-araw.'},
      {text:'Instant noodles at canned goods lang',costScale:0.25,impact:{energy:1,health:-1},type:'balance',feedback:'Nakatipid ka pero hindi masustansya. Ingatan ang kalusugan.'},
      {text:'Kain sa labas na lang araw-araw',costScale:1.1,impact:{energy:1,stress:1},type:'negative',feedback:'Masarap pero grabe ang nagastos! Mas mahal ito ng halos doble sa grocery.'},
    ]
  },

  // ── FAMILY (5) ───────────────────────────────────────────────
  {
    id:'family-sick',
    category:'family',
    loc:'Sa Bahay',
    title:'May Nagkasakit sa Bahay',
    text:'Isang miyembro ng pamilya mo ay may lagnat at kailangan ng gamot. Ikaw ang pinakamalapit na may pera.',
    choices:[
      {text:'Ibigay ang pera para sa gamot',costScale:0.5,impact:{family:3,health:1},type:'positive',feedback:'Nagpasalamat ang pamilya mo nang husto. Ang pag-aalaga ay walang katumbas.'},
      {text:'Sabihing wala kahit may pera',costScale:0,impact:{family:-3,stress:2},type:'negative',feedback:'Nasaktan ang pamilya mo. Laging nandoon para sa kanila tuwing kailangan nila.'},
    ]
  },
  {
    id:'family-help',
    category:'family',
    loc:'Sa Bahay',
    title:'Nanay/Tatay Kulang sa Pera',
    text:'Nagtatanong si Nanay kung may maliliit kang maibigay para sa pagkain o bayarin. Kulang sila ngayong araw.',
    choices:[
      {text:'Ibigay ang kaya mo',costScale:0.2,impact:{family:3},type:'positive',feedback:'Napakabait mo! Ang tulong sa pamilya ay hindi kailanman nasayang.'},
      {text:'Sabihing wala kahit may pera',costScale:0,impact:{family:-2,stress:2},type:'negative',feedback:'Okay lang umamin na may pera. Mas okay ang maging tapat sa pamilya.'},
    ]
  },
  {
    id:'family-chores',
    category:'family',
    loc:'Sa Bahay',
    title:'Tulong sa Bahay — May Bayad!',
    text:'Nag-aalok ang magulang mo ng bayad kung tutulungan mo sa gawaing bahay ngayong hapon.',
    choices:[
      {text:'Tulong agad! (kumita)',costScale:-0.2,impact:{family:2,energy:-1},type:'positive',feedback:'Mabuti! Kumita at natulungan ang pamilya. Win-win!'},
      {text:'Maglaro / mag-relax muna',costScale:0,impact:{family:-1},type:'negative',feedback:'Naiwan ang pamilya ng tulong. Sana sundin mo na next time.'},
    ]
  },
  {
    id:'family-visitor',
    category:'family',
    loc:'Sa Bahay',
    title:'Bisita mula sa Probinsya!',
    text:'Dumating ang kamag-anak mula sa probinsya. Gusto nilang ilabas ka nila para manghain. Kailangan mo ring mag-ambag.',
    choices:[
      {text:'Sumama at mag-ambag',costScale:0.3,impact:{family:3,stress:-1},type:'positive',feedback:'Ang saya ng reunion! Mga kwento at tawanan hanggang gabi. Priceless.'},
      {text:'Sumama pero hindi mag-ambag',costScale:0,impact:{family:1,stress:-1},type:'balance',feedback:'Nandoon ka para sa pamilya. Okay din kahit hindi ka nag-ambag.'},
      {text:'Busy — umakyat sa kwarto',costScale:0,impact:{family:-2},type:'negative',feedback:'Naghintay sila sa iyo. Minsan, ang family time ay mas mahalaga kaysa trabaho.'},
    ]
  },
  {
    id:'family-sibling',
    category:'family',
    loc:'Sa Bahay',
    title:'Kapatid Kailangan ng School Money',
    text:'Kapatid mo: "Kulang pera ko para sa project. Pwede kang magpahiram? Ibabalik ko pagka-allowance."',
    choices:[
      {text:'Ipahiram ang pera',costScale:0.25,impact:{family:2},type:'positive',feedback:'Mabuting kapatid ka! Siguraduhin lang na ibabalik niya.'},
      {text:'Ibigay na — hindi na kailangang ibalik',costScale:0.25,impact:{family:3},type:'positive',feedback:'Napakabuting kapatid! Sobrang natuwa siya.'},
      {text:'Hindi — baka hindi ibalik',costScale:0,impact:{family:-1},type:'negative',feedback:'Naiintindihan mo ang concern pero nasaktan ang pakiramdam ng kapatid mo.'},
    ]
  },

  // ── FRIENDS / SOCIAL (4) ─────────────────────────────────────
  {
    id:'social-barkada',
    category:'social',
    loc:'Sa Labas',
    title:'Barkada Outing!',
    text:'"Tara na!" sabi ng mga kaibigan. May lakad sila — kain, mall, o kape. Budget kailangan.',
    choices:[
      {text:'Sumama at mag-enjoy',costScale:0.4,impact:{friendship:2,stress:-2},type:'positive',feedback:'Ang saya ng samahan! Memories for life.'},
      {text:'Suggest mas murang lugar',costScale:0.1,impact:{friendship:1,stress:-1},type:'balance',feedback:'Budget-friendly pero nag-enjoy pa rin. Good compromise!'},
      {text:'Mag-decline — walang budget',costScale:0,impact:{friendship:-1,stress:1},type:'negative',feedback:'Naiintindihan nila pero may FOMO ka rin. Sana mag-ipon ka para sa susunod.'},
    ]
  },
  {
    id:'social-birthday',
    category:'social',
    loc:'Sa Klase',
    title:'Birthday ng Kaibigan!',
    text:'Kaarawan ng kaibigan o kaklase. Nag-aayos ang grupo ng regalo o cake. Magkano ang iaambag mo?',
    choices:[
      {text:'Mag-ambag ng buong share',costScale:0.35,impact:{friendship:2},type:'positive',feedback:'Masaya ang celebration! Salamat sa iyo.'},
      {text:'Mag-ambag ng kalahati',costScale:0.18,impact:{friendship:1},type:'balance',feedback:'Okay din! Hindi ka nag-iwan ng barkada.'},
      {text:'Gumawa ng handmade card (libre)',costScale:0,impact:{friendship:1},type:'balance',feedback:'Mas may pagmamahal pa nga! Creative at matipid.'},
      {text:'Wala — wala kang pera ngayon',costScale:0,impact:{friendship:-2},type:'negative',feedback:'Medyo nalungkot ang kaibigan mo. Sana may konti kang maibigay next time.'},
    ]
  },
  {
    id:'social-peer-pressure',
    category:'social',
    loc:'Sa Labas',
    title:'Pinipilit ng Barkada',
    text:'"Halika na! Isang beses lang ito!" Ang barkada mo ay nag-iinsist na sumama ka sa isang mahal na aktibidad na hindi mo nakaplano.',
    choices:[
      {text:'Sumama — baka mawala ang pagkakataon',costScale:0.6,impact:{friendship:2,stress:-1},type:'positive',feedback:'Nag-enjoy ka! Pero ngayon ay kulang na ang budget mo para sa ibang kailangan.'},
      {text:'Mag-explain ng budget at mag-decline',costScale:0,impact:{friendship:0,stress:-1},type:'balance',feedback:'Mature na sagot! Tunay na kaibigan ang mag-uunawa sa iyong budget.'},
      {text:'Umutang sa kaibigan para sumama',costScale:0.6,impact:{friendship:1,stress:2},type:'negative',feedback:'Nag-enjoy ka pero may utang ka na ngayon. Stress sa susunod na linggo.'},
    ]
  },
  {
    id:'social-group-gift',
    category:'social',
    loc:'Sa Klase',
    title:'Group Gift para sa Teacher',
    text:'May espesyal na okasyon ang paboritong teacher mo. Nag-iipon ang klase para sa regalo. ₱50 bawat isa ang hinihingi.',
    choices:[
      {text:'Mag-ambag ng buong ₱50',costScale:0.35,impact:{friendship:1,grades:1},type:'positive',feedback:'Masaya ang buong klase! At napapansin ka ng teacher.'},
      {text:'Mag-ambag ng konti lang',costScale:0.15,impact:{friendship:0},type:'balance',feedback:'Okay din. Nag-ambag ka naman kahit konti.'},
      {text:'Hindi mag-ambag — gusto mong makatipid',costScale:0,impact:{friendship:-1},type:'negative',feedback:'Napansin ng mga kaklase. Minsan ang maliit na ambag ay malaki ang kahulugan.'},
    ]
  },

  // ── ACADEMICS (4) ────────────────────────────────────────────
  {
    id:'academics-materials',
    category:'academics',
    loc:'Sa Bookstore',
    title:'Project Materials Kailangan',
    text:'May group project. Kailangan ng poster board, markers, at iba pang materials. Karamihan sa grupo ay wala.',
    choices:[
      {text:'Bilhin lahat ikaw lang',costScale:0.45,impact:{grades:3,stress:2,friendship:1},type:'positive',feedback:'Maganda ang project! Pero usapan ang fairness sa grupo next time.'},
      {text:'Fair split — bayaran ang sariling share',costScale:0.15,impact:{grades:1},type:'balance',feedback:'Tama! Lahat may responsibilidad sa grupo.'},
      {text:'Gumamit ng likas / recycled na materials',costScale:0,impact:{grades:1},type:'balance',feedback:'Eco-friendly at creative! Nag-appreciate pa ang teacher.'},
    ]
  },
  {
    id:'academics-supplies',
    category:'academics',
    loc:'Sa Paaralan',
    title:'School Supplies Nasira na',
    text:'Gutay na ang notebook mo at walang tintang pen. Kailangan mo para sa klase bukas.',
    choices:[
      {text:'Bumili ng bago',costScale:0.2,impact:{grades:2},type:'positive',feedback:'Handa ka na sa notes! Gagana ka ng maayos ngayon.'},
      {text:'Gumamit ng naiiwan pang papel',costScale:0,impact:{grades:-1},type:'negative',feedback:'Mahirap i-notes nang maayos. Baka mahuli ka sa leksyon.'},
    ]
  },
  {
    id:'academics-review',
    category:'academics',
    loc:'Sa Paaralan',
    title:'Exam Bukas — Kailangan ng Review Materials',
    text:'Malaking exam bukas. Wala kang sariling reviewer. Pwedeng bumili ng printed notes o mag-photocopy.',
    choices:[
      {text:'Bumili ng reviewer',costScale:0.2,impact:{grades:2,stress:-1},type:'positive',feedback:'Handa ka! Mas malinis at organisado ang review mo.'},
      {text:'Mag-photocopy ng notes ng kaibigan',costScale:0.08,impact:{grades:1,friendship:1},type:'balance',feedback:'Matipid at nakatulong pa ang kaibigan mo. Win-win!'},
      {text:'Mag-aral na lang gamit phone/memory',costScale:0,impact:{grades:0,energy:-1},type:'neutral',feedback:'Kaya mo naman. Pero mas mahirap mag-review nang walang materials.'},
    ]
  },
  {
    id:'academics-field-trip',
    category:'academics',
    loc:'Sa Paaralan',
    title:'Field Trip o Educational Event!',
    text:'May educational na lakad ang school. Kasama na ang bus at entrance fee. Required ba ito?',
    choices:[
      {text:'Sumali — educational naman',costScale:0.75,impact:{grades:2,friendship:2,stress:-1},type:'positive',feedback:'Napakaraming natutunan! Best day ng school year. Worth every peso.'},
      {text:'Mag-pa-excuse — mahal kasi',costScale:0,impact:{grades:-1,friendship:-1,stress:1},type:'negative',feedback:'Natipid ka pero FOMO ka buong linggo. May missed lessons ka pa rin.'},
    ]
  },

  // ── HEALTH (4) ───────────────────────────────────────────────
  {
    id:'health-sick',
    category:'health',
    loc:'Sa Botika',
    title:'May Ubo at Sipon — 3 Araw na',
    text:'Hindi ka na gumagaling. Kailangan na ng gamot. Pupunta ka ba sa botika o magtitiis pa?',
    choices:[
      {text:'Bumili ng gamot',costScale:0.5,impact:{health:3,energy:2},type:'positive',feedback:'Gumaling ka agad! Ang kalusugan ay kayamanan. Huwag ipagpaliban.'},
      {text:'Tibay lang — madadaan din',costScale:0,impact:{health:-2,energy:-2,stress:1,grades:-1},type:'negative',feedback:'Lumala ang sakit mo. Lumiban ka pa sa school. Hindi sulit ang tiis.'},
    ]
  },
  {
    id:'health-hygiene',
    category:'health',
    loc:'Sa Tindahan',
    title:'Kailangan ng Personal Hygiene Items',
    text:'Ubos na ang sabon, shampoo, at toothpaste mo. Kailangan bilhin ngayon. Pwedeng brand o generic.',
    choices:[
      {text:'Branded items',costScale:0.4,impact:{health:1,stress:-1},type:'positive',feedback:'Quality products! Pero regular na gastos ito buwan-buwan.'},
      {text:'Generic / sachets lang',costScale:0.15,impact:{health:1},type:'balance',feedback:'Smart! Parehong epektibo. Malaking tipid sa buong taon.'},
      {text:'Hiram muna sa kasambahay/kaibigan',costScale:0,impact:{health:0,friendship:-1},type:'negative',feedback:'Nakahiram ka — pero hindi magandang ugali ito palagi.'},
    ]
  },
  {
    id:'health-exercise',
    category:'health',
    loc:'Sa Parke / Gym',
    title:'Oras na para mag-Exercise!',
    text:'Matagal ka nang hindi nag-eexercise. May libre pang parke sa tabi, o may bayad na gym.',
    choices:[
      {text:'Mag-gym (may bayad)',costScale:0.5,impact:{health:2,stress:-2,energy:-1},type:'positive',feedback:'Serious ka sa fitness! Pero regular na gastos ito. Worth it ba buwan-buwan?'},
      {text:'Mag-exercise sa parke (libre!)',costScale:0,impact:{health:2,stress:-1,energy:-1},type:'balance',feedback:'Libre at epektibo pa rin! Fresh air pa ang bonus.'},
      {text:'Bukas na lang — pagod ngayon',costScale:0,impact:{health:-1,stress:1},type:'negative',feedback:'"Bukas na lang" palagi ang sabi mo. Hindi pa rin tayo nag-eexercise.'},
    ]
  },
  {
    id:'health-mental',
    category:'health',
    loc:'Sa Bahay',
    title:'Stressed Ka na — Kailangan ng Break',
    text:'Grabe ang stress mo ngayon. Matagal ka nang hindi nagpapahinga nang maayos. Ano ang gagawin mo?',
    choices:[
      {text:'Mag-self-care — treat yourself (may bayad)',costScale:0.4,impact:{stress:-3,energy:2,health:1},type:'positive',feedback:'Deserve mo ito! Hindi selfishness ang mag-alaga ng sarili. Essential ito.'},
      {text:'Mag-pahinga lang sa bahay (libre)',costScale:0,impact:{stress:-2,energy:2},type:'balance',feedback:'Okay din! Minsan ang simpleng pahinga sa bahay ay sapat na.'},
      {text:'Push through — kaya pa',costScale:0,impact:{stress:2,health:-1,grades:-1},type:'negative',feedback:'Burnout ang katapusan nito. Huwag balewalain ang mental health.'},
    ]
  },

  // ── LEISURE / TECH (4) ───────────────────────────────────────
  {
    id:'leisure-gaming',
    category:'leisure',
    loc:'Sa Gaming Café / Arcade',
    title:'Game Time with Friends!',
    text:'Nag-iimbitahan ang mga kaibigan na maglaro. May bayad ang bawat session.',
    choices:[
      {text:'Sumali sa buong session',costScale:0.5,impact:{friendship:2,stress:-3},type:'positive',feedback:'Ang saya! Nagbond kayo nang maayos.'},
      {text:'Kalahating session lang',costScale:0.25,impact:{friendship:1,stress:-1},type:'balance',feedback:'Nakatipid at nag-enjoy pa rin. Tamang desisyon.'},
      {text:'Manood lang — hindi gumastos',costScale:0,impact:{friendship:1},type:'neutral',feedback:'Nandoon ka pa rin para sa barkada. Okay lang.'},
    ]
  },
  {
    id:'leisure-entertainment',
    category:'leisure',
    loc:'Sa Sinehan / Concert',
    title:'Entertainment Event!',
    text:'May showing o event na gusto mong puntahan. Mahal ang ticket pero isang beses lang ito.',
    choices:[
      {text:'Bumili ng ticket',costScale:0.75,impact:{stress:-2,friendship:1},type:'positive',feedback:'Worth it! Narelax ka at nag-enjoy. Deserve mo yan.'},
      {text:'Manood ng livestream / libre na bersyon',costScale:0.05,impact:{stress:-1},type:'balance',feedback:'Okay din! Nakatipid ka ng malaki at nakita mo pa rin ang event.'},
      {text:'Skip na lang — mahal',costScale:0,impact:{stress:1,friendship:-1},type:'negative',feedback:'Naiwan ka sa barkada. Sana mag-ipon ka para sa susunod.'},
    ]
  },
  {
    id:'leisure-gadget',
    category:'leisure',
    loc:'Sa Repair Shop',
    title:'Gadget Emergency!',
    text:'Ang gadget mo (phone screen, earphones, atbp.) ay nasira. Kailangan mo ito para sa pag-aaral at komunikasyon.',
    choices:[
      {text:'I-repair o palitan agad',costScale:1.2,impact:{stress:1,grades:1,energy:1},type:'positive',feedback:'Kailangan mo talaga ito. Worth the investment para sa academics at komunikasyon.'},
      {text:'Gamitin pa kahit sira',costScale:0,impact:{stress:2,energy:-1},type:'negative',feedback:'Mahirap gamitin at nakaka-stress. Ayusin mo na bago lumala.'},
    ]
  },
  {
    id:'leisure-load',
    category:'leisure',
    loc:'Sa Sari-Sari Store',
    title:'Kailangan ng Load / Data',
    text:'Ubos na ang load at data mo. Hindi ka makakonekta sa internet para sa homework at komunikasyon sa pamilya.',
    choices:[
      {text:'Mag-load ng malaki — may data pa para sa buwan',costScale:0.4,impact:{grades:1,family:1,stress:-1},type:'positive',feedback:'Smart! Mas sulit ang bulk load kaysa araw-araw na pagbili.'},
      {text:'Maliit na load lang — para ngayon',costScale:0.12,impact:{grades:0,family:1},type:'neutral',feedback:'Okay para ngayon pero uubos ulit agad. Hindi cost-efficient.'},
      {text:'Humingi ng WiFi sa kapitbahay',costScale:0,impact:{family:0,stress:1},type:'balance',feedback:'Nakakonekta ka naman. Pero hindi palagi itong opsyon.'},
    ]
  },

  // ── SAVINGS & BUDGETING (4) ───────────────────────────────────
  {
    id:'savings-temptation',
    category:'savings',
    loc:'Sa Mall / Tindahan',
    title:'Nakakaakit na Sale!',
    text:'May malaking sale ngayon. Gusto mong bilhin ang item na matagal mo nang gusto. Hindi naman kailangan pero sobrang baba ng presyo.',
    choices:[
      {text:'Bilhin na — baka mawala ang sale!',costScale:0.8,impact:{stress:-1},type:'neutral',feedback:'Nakuha mo ang gusto mo! Pero kumain ito ng malaking parte ng budget mo ngayon.'},
      {text:'Ilagay sa wishlist — ipon muna',costScale:0,impact:{stress:0},type:'balance',feedback:'Disciplined ka! Kung talagang gusto mo ito, mas masaya pag may ipon ka para dito.'},
      {text:'Mag-isip muna ng 24 oras bago bumili',costScale:0,impact:{stress:-1},type:'balance',feedback:'The 24-hour rule! Madalas, nawawala ang gusto pag natulog ka na.'},
    ]
  },
  {
    id:'savings-ipon',
    category:'savings',
    loc:'Sa Bahay',
    title:'Mag-Ipon Ba Ngayong Linggo?',
    text:'Natanggap mo ang allowance mo. May natitira ka pagkatapos ng lahat ng gastos. Ano ang gagawin mo sa sobra?',
    choices:[
      {text:'Ilagay sa ipon agad',costScale:-0.3,impact:{stress:-1},type:'positive',feedback:'Excellent! Ang ugali ng pag-ipon ay mas mahalaga kaysa halaga. Habit ito.'},
      {text:'Gamitin sa kasiyahan ngayon',costScale:0.3,impact:{stress:-2,friendship:1},type:'neutral',feedback:'Nag-enjoy ka! Pero wala kang naipong extra para sa emergency.'},
      {text:'Iwan lang — baka kailanganin',costScale:0,impact:{stress:0},type:'balance',feedback:'Safe choice. Hindi mo ginastos pero hindi rin aktibong nag-ipon.'},
    ]
  },
  {
    id:'savings-emergency',
    category:'savings',
    loc:'Sa Bahay',
    title:'Biglang Kailangan ng Pera!',
    text:'May hindi inaasahang gastos ngayon — may nasira, may kailangan, o may emergency. Wala kang ipon.',
    choices:[
      {text:'Humiram sa kaibigan',costScale:0,impact:{friendship:-1,stress:2},type:'negative',feedback:'Nakaraos ka pero may utang ka na ngayon. Ito ang dahilan kung bakit kailangan mag-ipon.'},
      {text:'Kumuha sa allowance kahit kulang na',costScale:0.5,impact:{stress:2},type:'neutral',feedback:'Nagawa mo pero halos wala ka nang pang-bukas. Lesson: laging mag-ipon ng emergency fund.'},
      {text:'Kausapin ang magulang nang tapat',costScale:0,impact:{family:1,stress:-1},type:'balance',feedback:'Tama! Hindi kahihiyan ang humingi ng tulong sa pamilya. Tapat at marunong kang humingi.'},
    ]
  },
  {
    id:'savings-utang',
    category:'savings',
    loc:'Sa Klase',
    title:'Kaibigan Humihingi ng Utang',
    text:'Kaibigan: "Pre, pahiram ng pera. Emergency daw. Ibabalik bukas." Ito na ang ikatlong beses ngayong buwan.',
    choices:[
      {text:'Ipahiram ulit — kaibigan naman',costScale:0.3,impact:{friendship:1,stress:1},type:'neutral',feedback:'Mabuting puso mo. Pero pag-isipan kung lagi kang ginagamit na ATM ng kaibigan.'},
      {text:'Mag-decline nang maayos',costScale:0,impact:{friendship:-1,stress:-1},type:'balance',feedback:'Tama! May karapatan kang mag-decline. Ang tunay na kaibigan ay uunawa.'},
      {text:'Ibigay pero sabihing huli na ito',costScale:0.3,impact:{friendship:0,stress:1},type:'balance',feedback:'May hangganan ka. Siguraduhing sinunod niya ang sinabi mo.'},
    ]
  },

  // ── EARNING (3) ──────────────────────────────────────────────
  {
    id:'earn-sidejob',
    category:'earning',
    loc:'Sa Komunidad / Online',
    title:'May Pagkakataon na Kumita!',
    text:'May nag-aalok ng trabaho o gig sa iyo — tutoring, gawaing bahay, o simpleng task. Tanggapin mo ba?',
    choices:[
      {text:'Tanggapin ang trabaho (kumita!)',costScale:-0.75,impact:{stress:2,energy:-2,grades:-1},type:'positive',feedback:'Kumita ka ng sarili mong pera! Pero bantayan ang energy at grades.'},
      {text:'Mag-focus muna sa pag-aaral',costScale:0,impact:{grades:1,stress:-1},type:'neutral',feedback:'Maayos na desisyon. Estudyante ka pa — studies first.'},
    ]
  },
  {
    id:'earn-recycle',
    category:'earning',
    loc:'Sa Bahay',
    title:'Mag-Benta ng Lumang Gamit!',
    text:'Marami kang lumang gamit — books, clothes, gadgets — na hindi na ginagamit. Pwede mong ibenta o ialay.',
    choices:[
      {text:'Ibenta online o sa ukay',costScale:-0.4,impact:{family:1,stress:-1},type:'positive',feedback:'One person\'s trash is another\'s treasure! Kumita ka at nalinis pa ang kwarto mo.'},
      {text:'Ialay sa charity',costScale:0,impact:{family:2,stress:-1},type:'positive',feedback:'Napakabuting gawa! Hindi mo kumita pero nakatulong ka sa iba. Priceless.'},
      {text:'Itago pa — baka kailanganin pa',costScale:0,impact:{stress:1},type:'neutral',feedback:'Baka hindi mo na talaga ito magagamit. Pag-isipan mo ulit.'},
    ]
  },
  {
    id:'earn-allowance-timing',
    category:'earning',
    loc:'Sa Bahay',
    title:'Natanggap ang Allowance — Ano Muna?',
    text:'Natanggap mo ang allowance mo para sa linggo. Paano mo ito ayusin bago gumastos?',
    choices:[
      {text:'Hatiin agad — ipon, kailangan, kasiyahan',costScale:0,impact:{stress:-2,grades:1},type:'positive',feedback:'50-30-20 rule in action! Ang pag-budget bago gumastos ay susi sa financial health.'},
      {text:'Gamitin lang — ayusin kung kulang na',costScale:0,impact:{stress:1},type:'negative',feedback:'Madalas, kulang ka na bago pa matapos ang linggo. Plan mo ang pera, hindi ka nito pagpaplano.'},
      {text:'Bayaran muna ang utang bago iba',costScale:0.2,impact:{friendship:1,stress:-1},type:'balance',feedback:'Tama! Utang muna, bago kasiyahan. Mabuting financial habit ito.'},
    ]
  },

  // ── GROOMING & SELF-CARE (3) ─────────────────────────────────
  {
    id:'groom-haircut',
    category:'grooming',
    loc:'Sa Barbero / Salon',
    title:'Haircut Time!',
    text:'Mahahaba na ang buhok mo. Kailangan na ng gupit bago ang malaking okasyon o exam week.',
    choices:[
      {text:'Mag-salon / barbero',costScale:0.5,impact:{stress:-1,energy:1},type:'positive',feedback:'Fresh at presentable ka! Confident ka na lumabas.'},
      {text:'Hilingin sa kaibigan o kapatid na gupitin',costScale:0,impact:{friendship:1,family:1},type:'balance',feedback:'Libre at masaya pa! Basta handa kang tanggapin ang resulta.'},
    ]
  },
  {
    id:'groom-clothes',
    category:'grooming',
    loc:'Sa Ref o Tingi-tingi',
    title:'Damit para sa Espesyal na Okasyon',
    text:'May espesyal na event sa school o pamilya. Gusto mo ng bagong damit pero mahal ang bago.',
    choices:[
      {text:'Bumili ng bago',costScale:0.8,impact:{stress:-1,friendship:1},type:'positive',feedback:'Confident ka at bagong-bago! Pero malaki ang gastos para sa isang okasyon lang.'},
      {text:'Mag-ukay-ukay',costScale:0.2,impact:{stress:-1},type:'balance',feedback:'Budget-friendly at may pa-adventure pa! Madalas, may nahanap na mas maganda pa.'},
      {text:'Gamitin na lang ang mayroon',costScale:0,impact:{stress:0},type:'balance',feedback:'Practical! Ang damit ay hindi sukatan ng pagkatao. Ikaw pa rin ang maganda.'},
    ]
  },
  {
    id:'groom-school-uniform',
    category:'grooming',
    loc:'Sa Tindahan',
    title:'Uniform Nasira / Kupas na',
    text:'Ang uniform mo ay kupas na at may butas pa. Pwede pa nang gamitin pero hindi maganda tingnan.',
    choices:[
      {text:'Magpabili ng bago',costScale:0.9,impact:{grades:1,stress:-1},type:'positive',feedback:'Presentable ka na! Good impression sa school.'},
      {text:'Ipasulsi muna ang mayroon',costScale:0.1,impact:{energy:0},type:'balance',feedback:'Practical! Natipid ka at okay pa naman ang dating.'},
      {text:'Gamitin pa kahit kupas',costScale:0,impact:{stress:1},type:'neutral',feedback:'Okay pa rin naman. Pero pag-isipan mo na ring magpalit sa susunod na allowance.'},
    ]
  },

];

// ─── SCENARIO POOL BUILDER ─────────────────────────────────
// Returns a shuffled pool of universal scenarios for any grade level.
// Call this instead of referencing scenariosDB[gradeKey] directly.
function buildScenarioPool(gradeKey) {
  const cfg = gradeConfig[gradeKey];
  if (!cfg) return [];

  // Clone and attach scaled costs to each choice
  return universalScenarios.map(scenario => {
    const scaled = {
      ...scenario,
      choices: scenario.choices.map(choice => ({
        ...choice,
        cost: Math.round(cfg.weeklyAllowance * choice.costScale),
        // Override display text with scaled peso amount
        text: choice.text + (choice.costScale !== 0
          ? (choice.costScale < 0
              ? ` (+₱${Math.abs(Math.round(cfg.weeklyAllowance * choice.costScale))})`
              : ` (−₱${Math.round(cfg.weeklyAllowance * choice.costScale)})`)
          : ''),
      })),
    };
    return scaled;
  });
}

// ─── LEGACY COMPAT: scenariosDB still works if referenced elsewhere ─
// Maps each grade key to the universal pool (lazily built on first access)
const scenariosDB = new Proxy({}, {
  get(_, gradeKey) {
    return buildScenarioPool(gradeKey);
  }
});

// ─── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = 'tip') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { if (t) t.className = 'toast'; }, 2800);
}

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }