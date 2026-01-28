import { supabase } from './supabaseClient.js';

async function verificarUsuarios() {
  try {
    console.log('Verificando usuários no Supabase...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return;
    }
    
    console.log('Usuários encontrados:', users);
    
    if (users && users.length > 0) {
      console.log(`\nTotal de usuários: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Papel: ${user.role || 'user'}`);
        console.log(`   Criado em: ${user.created_at}`);
        console.log(`   Último acesso: ${user.last_sign_in_at || 'Nunca'}`);
      });
    } else {
      console.log('Nenhum usuário encontrado na tabela users.');
      
      // Verificar se a tabela existe
      console.log('\nVerificando se a tabela users existe...');
      const { data: tables, error: tablesError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (tablesError) {
        console.error('Erro ao acessar tabela users:', tablesError);
        console.log('A tabela users pode não existir. Você precisa criá-la.');
      }
    }
    
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

verificarUsuarios();
