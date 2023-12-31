import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import API from '@/services/api'
import { useToastStore } from '@/stores/toast';
import { useLoadingStore } from "./loader";
import { getVersion } from "@/utils/application";

type InfoType = {
  client: null | string
  api: null | string
  git: null | string
}

export const useAppStore = defineStore('app', () => {
  const information = reactive<InfoType>({ client: getVersion() || null, api: null, git: null })

  const getAppInformation = () => {
    return Promise.all([
      getApiVersion(),
      getLatestCommit()
    ])
    .catch((err) => {
      clearInformation()
      useToastStore().setToast(true, err, true)
    })
  }

  const getApiVersion = () => {
    return API.getApiVersion()
    .then(({ data }) => information.api = data.version)
    .catch(err => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
  }

  const getLatestCommit = () => {
    return API.getLatestCommitSha()
    .then(({ data }) => information.git = data[0].sha.substring(0, 7))
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
  }

  const displayAppInformation = () => {
    if ( retrievedInformationFailed.value ) 
      return

    const formattedInformation = `<pre>my-expenses ${ information.client }\napi ${ information.api }\ngit ${ information.git } </pre>`
    useToastStore().setToast(true, formattedInformation, false, 8000)
  }

  const clearInformation = () => Object.assign(information, { client: null, api: null, git: null })

  const retrievedInformationFailed = computed(() => Object.values(information).some(i => !i))

  return {
    information,
    getAppInformation,
    displayAppInformation
  }
})