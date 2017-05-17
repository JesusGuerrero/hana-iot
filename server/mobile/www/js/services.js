angular.module('starter.services', [])

  .factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'American Goldfinch',
      face: 'img/birds/0.jpg',
      size: 'Finches',
      length:'4.3–5.1',
      weight:'0.4–0.7',
      facts:'This handsome little finch, the state bird of New Jersey, Iowa, and Washington, is welcome and common at feeders, where it takes primarily sunflower and nyjer. '
    }, {
      id: 1,
      name: 'American Tree Sparrow',
      face: 'img/birds/1.jpg',
      size: 'Sparrows',
      length:'5.5',
      weight:'0.5–1',
      facts:'Plump and long-tailed, American Tree Sparrows are busy visitors in winter backyards and weedy, snow-covered fields across southern Canada and the northern United States.'
    },{
      id: 2,
      name: 'Band-tailed Pigeon',
      face: 'img/birds/2.jpg',
      size: 'Doves',
      length:'13–16',
      weight:'12–13',
      facts:'A backwoods relative of the ubiquitous Rock Pigeon, the Band-tailed Pigeon is common in forests of the Pacific Coast and the Southwest. A sociable bird with a mellow coo, it forms large flocks in mountain forests where it feeds on seeds and fruits.'
    }, {
      id: 3,
      name: 'Black-capped Chickadee',
      face: 'img/birds/3.jpg',
      size: 'Chickadees',
      length:'4.7–5.9',
      weight:'0.3–0.5',
      facts:'A bird almost universally considered “cute” thanks to its oversized round head, tiny body, and curiosity about everything, including humans.'
    }, {
      id: 4,
      name: 'Black-crested Titmouse',
      face: 'img/birds/4.jpg',
      size: 'Chickadees',
      length:'5.9',
      weight:'0.9',
      facts:'A bird of Texas and northeastern Mexico, the Black-crested Titmouse is common in oak woods and towns.'
    },{
      id: 5,
      name: 'Blue Jay',
      face: 'img/birds/5.jpg',
      size: 'Crows',
      length:'9.8–12',
      weight:'2.5–3.5',
      facts:'This common, large songbird is familiar to many people, with its perky crest; blue, white, and black plumage; and noisy calls. Blue Jays are known for their intelligence and complex social systems with tight family bonds.'
    }, {
      id: 6,
      name: 'Boreal Chickadee',
      face: 'img/birds/6.jpg',
      size: 'Chickadees',
      length:'4.7–5.5',
      weight:'0.2–0.4',
      facts:'A brown-capped chickadee of the northern boreal forest, the Boreal Chickadee is one of the few birds living completely within that biome in Canada and bits of the United States.'
    }, {
      id: 7,
      name: 'Brown-headed Cowbird',
      face: 'img/birds/7.jpg',
      size: 'Blackbirds',
      length:'7.5–8.7',
      weight:'1.5–1.8',
      facts:'The Brown-headed Cowbird is a stocky blackbird with a fascinating approach to raising its young. Females forgo building nests and instead put all their energy into producing eggs, sometimes more than three dozen a summer.'
    }, {
      id: 8,
      name: 'California Scrub-Jay',
      face: 'img/birds/8.jpg',
      size: 'Crows',
      length:'11–12',
      weight:'2.5–3.5',
      facts:'The “blue jay” of dry lowlands along the Pacific seaboard, the California Scrub-Jay combines deep azure blue, clean white underparts, and soft gray-brown.'
    }, {
      id: 9,
      name: 'Chipping Sparrow',
      face: 'img/birds/9.jpg',
      size: 'Sparrows',
      length:'4.7–5.9',
      weight:'0.4–0.6',
      facts:'A crisp, pretty sparrow whose bright rufous cap both provides a splash of color and makes adults fairly easy to identify.'
    }, {
      id: 10,
      name: 'Common Grackle',
      face: 'img/birds/10.jpg',
      size: 'Chickadees',
      length:'11–13',
      weight:'2.6–5',
      facts:'Common Grackles are blackbirds that look like they’ve been slightly stretched. They’re taller and longer tailed than a typical blackbird, with a longer, more tapered bill and glossy-iridescent bodies.'
    }, {
      id: 11,
      name: 'Common Ground-Dove',
      face: 'img/birds/11.jpg',
      size: 'Doves',
      length:'5.9–7.1',
      weight:'1.0–1.4',
      facts:'A dove the size of a sparrow, the Common Ground-Dove forages in dusty open areas, sometimes overshadowed by the grass clumps it is feeding beneath.'
    }, {
      id: 12,
      name: 'Dark-eyed Junco',
      face: 'img/birds/12.jpg',
      size: 'Sparrows',
      length:'5.5–6.3',
      weight:'0.6–1.1',
      facts:'Dark-eyed Juncos are neat, even flashy little sparrows that flit about forest floors of the western mountains and Canada, then flood the rest of North America for winter.'
    }, {
      id: 13,
      name: 'Eurasian Collared-Dove',
      face: 'img/birds/13.jpg',
      size: 'Doves',
      length:'11–12',
      weight:'4.9–6.3',
      facts:'With a flash of white tail feathers and a flurry of dark-tipped wings, the Eurasian Collared-Dove settles onto phone wires and fence posts to give its rhythmic three-parted coo. '
    }, {
      id: 14,
      name: 'European Starling',
      face: 'img/birds/14.jpg',
      size: 'Blackbirds',
      length:'7.9–9.1',
      weight:'2.1–3.4',
      facts:'First brought to North America by Shakespeare enthusiasts in the nineteenth century, European Starlings are now among the continent’s most numerous songbirds. '
    }, {
      id: 15,
      name: 'Field Sparrow',
      face: 'img/birds/15.jpg',
      size: 'Sparrows',
      length:'4.7–5.9',
      weight:'0.4–0.5',
      facts:'The clear, “bouncing-ball” trill of the Field Sparrow is a familiar summer sound in brushy fields and roadsides of the East and Midwest. The singer is a small, warm-toned sparrow with a rusty cap, neat white eyering, and pink bill.'
    }, {
      id: 16,
      name: 'Great-tailed Grackle',
      face: 'img/birds/16.jpg',
      size: 'Blackbirds',
      length:'18.1',
      weight:'6.7',
      facts:'A big, brash blackbird, the male Great-tailed Grackle shimmers in iridescent black and purple, and trails a tail that will make you look twice. The rich brown females are about half the male’s size.'
    }, {
      id: 17,
      name: 'House Sparrow',
      face: 'img/birds/17.jpg',
      size: 'Sparrows',
      length:'5.9–6.7',
      weight:'1–1.1',
      facts:'You can find House Sparrows most places where there are houses (or other buildings), and few places where there aren’t. Along with two other introduced species, the European Starling and the Rock Pigeon, these are some of our most common birds.'
    }, {
      id: 18,
      name: 'Inca Dove',
      face: 'img/birds/18.jpg',
      size: 'Doves',
      length:'7.1–9.1',
      weight:'1.1–2',
      facts:'The tiny Inca Dove is covered in tan scaly-looking feathers and blends right in with its suburban desert habitats. That is, until it bursts into flight, making a dry rattling whir with its wings while flashing chestnut underwings and white in its tail.'
    }, {
      id: 19,
      name: 'Mourning Dove',
      face: 'img/birds/19.jpg',
      size: 'Doves',
      length:'9.1–13',
      weight:'3.4–6',
      facts:'A graceful, slender-tailed, small-headed dove that’s common across the continent. Mourning Doves perch on telephone wires and forage for seeds on the ground; their flight is fast and bullet straight.'
    }, {
      id: 20,
      name: 'Northern Cardinal',
      face: 'img/birds/20.jpg',
      size: 'Finches',
      length:'8.3–9.1',
      weight:'1.5–1.7',
      facts:'The male Northern Cardinal is perhaps responsible for getting more people to open up a field guide than any other bird. They’re a perfect combination of familiarity, conspicuousness, and style: a shade of red you can’t take your eyes off.'
    },{
      id: 21,
      name: 'Northern Flicker',
      face: 'img/birds/21.jpg',
      size: 'Woodpeckers',
      length:'11–12',
      weight:'3.9–5.6',
      facts:'Northern Flickers are large, brown woodpeckers with a gentle expression and handsome black-scalloped plumage. On walks, don’t be surprised if you scare one up from the ground.'
    },{
      id: 22,
      name: 'Pinyon Jay',
      face: 'img/birds/22.jpg',
      size: 'Crows',
      length:'10–11',
      weight:'3.2–4.2',
      facts:'A highly social bird of the lower mountain slopes of the western United States, the Pinyon Jay is specialized for feeding on pine seeds.'
    },{
      id: 23,
      name: 'Pyrrhuloxia',
      face: 'img/birds/23.jpg',
      size: 'Finches',
      length:'8.3',
      weight:'0.8–1.5',
      facts:'Dapper in looks and cheerful in song, the Pyrrhuloxia is a tough-as-nails songbird of baking hot deserts in the American Southwest and northern Mexico.'
    },{
      id: 24,
      name: 'Red-bellied Woodpecker',
      face: 'img/birds/24.jpg',
      size: 'Woodpeckers',
      length:'9.4',
      weight:'2–3.2',
      facts:'Red-bellied Woodpeckers are pale, medium-sized woodpeckers common in forests of the East. Their strikingly barred backs and gleaming red caps make them an unforgettable sight – just resist the temptation to call them Red-headed Woodpeckers, a somewhat rarer species that is mostly black on the back with big white wing patches. '
    },{
      id: 25,
      name: 'Red-winged Blackbird',
      face: 'img/birds/25.jpg',
      size: 'Blackbirds',
      length:'6.7–9.1',
      weight:'1.1–2.7',
      facts:'One of the most abundant birds across North America, and one of the most boldly colored, the Red-winged Blackbird is a familiar sight atop cattails, along soggy roadsides, and on telephone wires.'
    },{
      id: 26,
      name: 'Rock Pigeon',
      face: 'img/birds/26.jpg',
      size: 'Doves',
      length:'12–14',
      weight:'9–13',
      facts:'A common sight in cities around the world, Rock Pigeons crowd streets and public squares, living on discarded food and offerings of birdseed. In addition to the typical blue-gray bird with two dark wingbars, you willl often see flocks with plain, spotted, pale, or rusty-red birds in them.'
    },{
      id: 27,
      name: 'Steller’s Jay',
      face: 'img/birds/27.jpg',
      size: 'Crows',
      length:'12–14',
      weight:'3.5–4.9',
      facts:'A large, dark jay of evergreen forests in the mountainous West. Steller’s Jays are common in forest wildernesses but are also fixtures of campgrounds, parklands, and backyards, where they are quick to spy bird feeders as well as unattended picnic items. '
    },{
      id: 28,
      name: 'Woodhouse’s Scrub-Jay',
      face: 'img/birds/28.jpg',
      size: 'Crows',
      length:'12–14',
      weight:'3.5–4.9',
      facts:'The “blue jay” of dry lowlands from Nevada south to Mexico, Woodhouse’s Scrub-Jay is a dusty blue bird set off by gray-brown and white. It looks very similar to the California Scrub-Jay (they were considered the same species until 2016), but it’s a dimmer blue and dingier gray, with almost no necklace, a straighter bill, and higher-pitched calls.'
    }];

    return {
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

.factory('Records', function() {
  // Might use a resource here that returns a JSON array
  var severIPAddress = "http://hana.local:6085";
  // Some fake testing data
  var records = [{
    id: 0,
    name: 'Testing',
    face: severIPAddress + '/images/myImg_2017-05-17T20:56:31.332Z.jpg',
    date: '03.19.07',
    time: '6:35',
    food: 'Millet',
    note:'Take picture Testing'
  }, {
    id: 1,
    name: 'Inca Dove',
    face: severIPAddress + '/images/18.jpg',
    date: '03.19.07',
    time: '5:54',
    food: 'Millet',
    note:''
    }];

  return {
    all: function() {
      return records;
    },
    remove: function(record) {
      records.splice(records.indexOf(record), 1);
    },
    get: function(recordID) {
      for (var i = 0; i < records.length; i++) {
        if (records[i].id === parseInt(recordID)) {
          return records[i];
        }
      }
      return null;
    }
  };
});
