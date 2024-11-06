import { defineStore } from "pinia"
import { createToken, uploadDocument, getFile, getDocuments, getDocumentTypes, deleteDocument } from "@/api/document";
import { toast } from 'vue3-toastify';
import { ref } from "vue";

export const useDocumentStore = defineStore('document', () => {
    const documentTypes = ref([])

    const createTokens = async (payload) => {
        try {
            return await createToken(payload);
        } catch (err) {
            toast.error("An error occurred while create token. Please try again.");
            throw new Error(err);
        }
    };

    const uploadDocuments = async (payload) => {
        try {
            return await uploadDocument(payload);
        } catch (err) {
            toast.error("An error occurred while upload documents. Please try again.");
            throw new Error(err);
        }
    };

    const getDocument = async (payload) => {
        try {
            return await getDocuments(payload);
        } catch (err) {
            toast.error("An error occurred while get documents. Please try again.");
            throw new Error(err);
        }
    };

    const getFiles = async (payload) => {
        try {
            return await getFile(payload);
        } catch (err) {
            toast.error("An error occurred while get file. Please try again.");
            throw new Error(err);
        }
    };

    const deleteDocuments = async (payload) => {
        try {
            return await deleteDocument(payload);
        } catch (err) {
            toast.error("An error occurred while delete document. Please try again.");
            throw new Error(err);
        }
    };

    const getDocumentType = async (payload) => {
        try {
            let result = await getDocumentTypes(payload);
            setDocumentTypes(result?.Data);
        } catch (err) {
            toast.error("An error occurred while get document type. Please try again.");
            throw new Error(err);
        }
    };

    const setDocumentTypes = (payload) => {
        documentTypes.value = payload;
    }

    return { documentTypes, createTokens, uploadDocuments, getDocument, getFiles, getDocumentType, deleteDocuments }
})