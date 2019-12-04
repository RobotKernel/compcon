import { Pilot, MountType, EquippableMount, Frame } from '@/class'
import io from '@/features/_shared/data_io'
import { store } from '@/store'
import Vue from 'vue'

function isValidJSON(text: string): string | boolean {
  try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

// function convertMountData(old: any): IMountData {
//   return {
//     mount_type: old.mount_type,
//     lock: old.sh_lock || false,
//     slots: old.weapons.map((x: any) => ({
//       size: old.mount_type,
//       weapon: {
//         id: x.id,
//         notes: [],
//       },
//     })),
//     extra: [],
//     bonus_effects: [],
//   }
// }

// function convertMechLoadouts(old: any): IMechLoadoutData {
//   return {
//     id: old.id,
//     name: old.name,
//     systems: old.systems.map((x: any) => ({ id: x.id, notes: [] })),
//     integratedSystems: [],
//     mounts: old.mounts.map((x: any) => convertMountData(x)),
//     integratedMounts: [],
//     improved_armament: EquippableMount.Serialize(new EquippableMount(MountType.Flex)),
//     integratedWeapon: EquippableMount.Serialize(new EquippableMount(MountType.Aux)),
//     retrofitIndex: null,
//     retrofitOriginalType: null,
//   }
// }

// function convertMechs(old: any): IMechData {
//   return {
//     id: old.id,
//     name: old.name,
//     notes: '',
//     portrait: old.portrait || '',
//     cloud_portrait: '',
//     frame: old.frame_id || old.frame,
//     active: false,
//     current_structure: 0,
//     current_hp: 0,
//     current_stress: 0,
//     current_heat: 0,
//     current_repairs: 0,
//     current_overcharge: 0,
//     statuses: [],
//     conditions: [],
//     resistances: [],
//     burn: 0,
//     loadouts: old.loadouts.map((x: any) => convertMechLoadouts(x)),
//     active_loadout: null,
//     ejected: false,
//     destroyed: false,
//     reactor_destroyed: false,
//     meltdown_imminent: false,
//     cc_ver: Vue.prototype.version,
//   }
// }

// function licenseNameToId(name: string): string {
//   const frames = store.getters.getItemCollection('Frames') as Frame[]
//   const match = frames.find(x => x.Name === name)
//   return match ? match.ID : 'err'
// }

// function convertPilotLoadouts(old: any): IPilotLoadoutData {
//   return {
//     id: old.id,
//     name: old.name,
//     armor: old.items.armor.map((x: any) => (x ? { id: x.id, notes: [] } : null)),
//     weapons: old.items.weapon.map((x: any) => (x ? { id: x.id, notes: [] } : null)),
//     gear: old.items.gear.map((x: any) => (x ? { id: x.id, notes: [] } : null)),
//     extendedGear: [null, null],
//     extendedWeapons: [null],
//   }
// }

// function convertPilot(old: any): IPilotData {
//   return {
//     id: old.id,
//     cloudID: old.cloudID || old.gistID || '',
//     cloudOwnerID: '',
//     lastCloudUpdate: '',
//     level: old.level,
//     callsign: old.callsign,
//     name: old.name,
//     text_appearance: old.text_appearance || '',
//     player_name: old.player_name || '',
//     factionID: old.factionID || '',
//     status: old.status || 'ACTIVE',
//     notes: old.notes || '',
//     history: old.history || '',
//     portrait: old.portrait || '',
//     cloud_portrait: '',
//     quirk: '',
//     current_hp: old.current_hp || 6,
//     background: old.custom_background ? 'ai' : old.background,
//     reserves: [],
//     orgs: [],
//     mechSkills: [old.mechSkills.hull, old.mechSkills.agi, old.mechSkills.sys, old.mechSkills.eng],
//     licenses: old.licenses.map((x: any) => ({
//       id: licenseNameToId(x.name),
//       rank: x.level,
//     })),
//     skills: old.skills.map((x: any) => ({ id: x.id, rank: x.bonus / 2 })),
//     talents: old.talents.map((x: any) => ({ id: x.id, rank: x.rank })),
//     core_bonuses: old.core_bonuses,
//     loadouts: old.loadouts ? old.loadouts.map((x: any) => convertPilotLoadouts(x)) : [],
//     active_loadout_index: 1,
//     mechs: old.configs ? old.configs.map((x: any) => convertMechs(x)) : [],
//     active_mech: null,
//     cc_ver: Vue.prototype.version,
//   }
// }

export default {
  pilot(data: Pilot) {
    return this.checkVersion([data])[0]
  },
  checkVersion(data: any): IPilotData[] {
    let output = [] as IPilotData[]
    let copyOld = false
    data.forEach((e: any) => {
      if (e.status) output.push(e)
      else {
        copyOld = true
        //   try {
        //     output.push(convertPilot(e))
        //   } catch (err) {
        //     console.error('Conversion failure: ' + err)
        //   }
      }
    })
    if (copyOld) io.backup(store.getters.getUserPath)
    return output
  },
  // checkMechVersion(data: any): IMechData {
  //   if (data.cc_ver) return data
  //   else return convertMechs(data)
  // },
  importPilot(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Pilot data'
    } else {
      const p = JSON.parse(data)
      result = p
      // if (this.pilot(p)) {
      //   result = p
      // } else {
      //   err = 'Invalid pilot data'
      // }
    }
    callback(err, result)
  },
  clipboardConfig(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Config data'
    } else {
      const p = JSON.parse(data)
      result = p
      // if (this.checkMechVersion(p)) {
      //   result = p
      // } else {
      //   err = 'Invalid config data'
      // }
    }
    callback(err, result)
  },
}