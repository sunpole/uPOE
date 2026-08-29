(() => {
  'use strict';

  currency.simple = [
    "Chaos Orb","Armourer's Scrap","Blacksmith's Whetstone","Jeweller's Orb","Orb of Binding","Orb of Chance",
    "Alchemy Shard","Alteration Shard","Transmutation Shard","Orb of Transmutation","Orb of Augmentation","Portal Scroll",
    "Scroll of Wisdom","Chromatic Orb","Stacked Deck","Exalted Orb","Orb of Fusing","Orb of Alchemy","Orb of Alteration",
    "Orb of Regret","Orb of Scouring","Orb of Unmaking","Regal Orb","Instilling Orb","Blessed Orb","Gemcutter's Prism",
    "Glassblower's Bauble","Enkindling Orb","Abrasive Catalyst","Accelerating Catalyst","Imbued Catalyst","Intrinsic Catalyst",
    "Noxious Catalyst","Tainted Catalyst","Tempering Catalyst","Turbulent Catalyst","Unstable Catalyst","Fracturing Shard",
    "Tainted Blacksmith's Whetstone","Tainted Jeweller's Orb","Greater Eldritch Ichor","Lesser Eldritch Ember",
    "Lesser Eldritch Ichor","Grand Eldritch Ichor","Vaal Orb"
  ];

  currency.medium = [
    "Warlord's Exalted Orb","Shaper's Exalted Orb","Elder's Exalted Orb","Sacred Crystallised Lifeforce","Veiled Chaos Orb",
    "Sinistral Catalyst","Redeemer's Exalted Orb","Maven's Chisel of Proliferation","Crystallised Rancour",
    "Eldritch Orb of Annulment","Eldritch Chaos Orb","Prismatic Catalyst","Maven's Chisel of Scarabs",
    "Maven's Chisel of Divination","Maven's Chisel of Procurement","Crusader's Exalted Orb","Foulborn Orb of Augmentation",
    "Tainted Chromatic Orb","Orb of Intention","Eldritch Exalted Orb","Greater Eldritch Ember","Tainted Armourer's Scrap",
    "Grand Eldritch Ember","Foulborn Regal Orb","Orb of Annulment","Fertile Catalyst","Coin of Desecration",
    "Coin of Restoration","Coin of Knowledge","Coin of Power","Coin of Skill","Chaotic Astrolabe","Deceptive Astrolabe",
    "Fruiting Astrolabe","Fungal Astrolabe","Grasping Astrolabe","Lightless Astrolabe","Nameless Astrolabe",
    "Runic Astrolabe","Templar Astrolabe","Timeless Astrolabe","Sacred Orb","Tainted Chaos Orb","Tainted Mythic Orb",
    "Tainted Orb of Fusing","Orb of Unravelling","Ritual Vessel"
  ];

  currency.high = [
    "Mirror of Kalandra","Hinekora's Lock","Mirror Shard","Reflecting Mist","Veiled Exalted Orb",
    "Tainted Divine Teardrop","Volatile Vaal Orb","Orb of Dominance","Refracting Fog","Foulborn Exalted Orb",
    "Awakener's Orb","Tailoring Orb","Tempering Orb","Fracturing Orb","Orb of Conflict","Hunter's Exalted Orb",
    "Dextral Catalyst","Flesh of Xesht","Exceptional Eldritch Ember","Exceptional Eldritch Ichor","Tainted Exalted Orb",
    "Orb of Remembrance","Maven's Chisel of Avarice","Valdo's Puzzle Box","Eternal Orb","Divine Orb"
  ];

  currency.league = [
    "Dead Man's Sulphur","Message in a Bottle","Karui Enshrouding Crystal","Imperial Enshrouding Crystal","Vaal Enshrouding Crystal",
    "Templar Enshrouding Crystal","Maraketh Enshrouding Crystal","Merrick's Ducat","Cyaxan's Ducat","The Changeling's Ducat",
    "The Genteel's Ducat","Kishara's Ducat","Telesia's Ducat","Rotmother's Ducat","Brinehook's Ducat","Katakohi's Ducat",
    "Tzamoto's Ducat","Ukatoa's Ducat","Cursed Ducat (class)"
  ];

  tierNames.league = 'TIER 4 / LEAGUE + DYNAMIC';

  if (typeof mode !== 'undefined') {
    if (mode === 'all' && typeof renderAll === 'function') renderAll();
    else if (typeof renderRandom === 'function') renderRandom(false);
  }
})();
