/**
 * Configuração Central do Supabase
 * Centraliza URL, Chave de Acesso e Inicialização do Cliente
 */

const SUPABASE_URL = 'https://krxcmfsonqzfdywqedeg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGNtZnNvbnF6ZmR5d3FlZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjI5NzgsImV4cCI6MjA5NDI5ODk3OH0.X1LujCzqD3YcckIJf6XEu8Rzk0W3x6cx_-HxAczxtko';

// Inicializa o cliente uma única vez
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ID da Oficina Ativa (Busca do parâmetro 'id' na URL ou assume 1)
const urlParamsConfig = new URLSearchParams(window.location.search);
const OFICINA_ATIVA_ID = parseInt(urlParamsConfig.get('id')) || 1;
