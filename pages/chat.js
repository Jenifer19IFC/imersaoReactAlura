import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'; 


// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6

//Assume que pode ter acesso a algum navegador pelo meio sem backend:
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDg2OTA3MywiZXhwIjoxOTU2NDQ1MDczfQ.343ibq7UYFPDdyfsfGmEqUma01RW7P7KC9U2MDAGSkI';
//URL do papel de servidor:
const SUPABASE_URL = 'https://kysxypdmtxjlkdysdlas.supabase.co';
//URL do papel de servidor:
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem){
  return supabaseClient
  .from('mensagens')
  .on('INSERT', (repostaLive) => {
    adicionaMensagem(repostaLive.new);
  })
  .subscribe();
} 

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  //console.log('roteamento.query', roteamento.query);
  //console.log('usuarioLogado', usuarioLogado);
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  //Acionado somente em determinados casos
  React.useEffect(() => {
    supabaseClient
      .from('mensagens') //Nome da tabela
      .select('*') //Seleciona tudo
      .order('id', { ascending: false }) //Ordena as mensagens certinho
      .then(({ data }) => {
        console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
      });

        //onClick e escutaMensagensEmTempoReal são a mesma coisa
        //onClick dispara a função e escutaMensagensEmTempoReal... quer executar a função
      escutaMensagensEmTempoReal((novaMensagem) => {
        console.log('Nova mensagem:',novaMensagem);
        setListaDeMensagens((valorAtualDaLista) => {
          return [
            novaMensagem,
            ...valorAtualDaLista,
          ]
        });
      });
  }, []); //Se a mensagem mudar, observa as mudanças e roda denovo.

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from('mensagens')
      .insert([
        // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem
      ])
      .then(({ data }) => {
        console.log('Criando mensagem: ', data);
      });

    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        wordBreak: 'break-word',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          wordBreak: 'break-word',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%', //Altura da caixa do chat
          maxWidth: '95%',  //Largura da caixa do chat
          maxHeight: '95vh', //Altura da aparição das mensagens
          padding: '32px', //Tamanho do quadrado do meio
        }}
      >
        <Header />  {/*Nossa criação  ------- CHAMA A FUNÇÃO "HEADER"*/}
        <Box
          styleSheet={{
            wordBreak: 'break-word',
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList mensagens={listaDeMensagens} />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault(); //Previnir que o comportamento padrão do Enter  de pular de linha ao clicar
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            {/*Call Back --- Quando algo que eu queria terminou, ele executa o que passei*/}
            <ButtonSendSticker 
            //interceptação
                onStickerClick={(sticker) => {
                      console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                      handleNovaMensagem(':sticker:' + sticker);
               }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ 
        wordBreak: 'break-word',
        width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary' //Transparêcia ao passar o mouse no logout
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

//<div>{word-break: break-word;}</div>
function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        wordBreak: 'break-word',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                wordBreak: 'break-word',
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  wordBreak: 'break-word',
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {/* Declarativo */}
            {/* Condicional: {mensagem.texto.startsWith(':sticker').toString()}*/}
            {mensagem.texto.startsWith(':sticker')
             ? ( // É sticker?Se sim...
                <Image src={mensagem.texto.replace(':sticker','')} /> // REPLACE tira o pedaço ali
            )
            :(//Caso contrário...
              mensagem.texto
            )}
            {/*mensagem.texto*/ }
          </Text>
        );
      })}
    </Box>
  )
}