import appConfig from '../config.json';

function GlobalStyle() {
    return (
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          list-style: none;
        }
        body {
          font-family: 'Open Sans', sans-serif;
        }
        /* App fit Height */ 
        html, body, #__next {
          min-height: 100vh;
          display: flex;
          flex: 1;
        }
        #__next {
          flex: 1;
        }
        #__next > * {
          flex: 1;
        }
        /* ./App fit Height */ 
      `}</style>
    );
  }
function Title(props){
    console.log(props);
    const Tag = props.tag;
    return (
    <>
        <Tag>{props.children}</Tag>
        <style jsx>{`
        ${Tag} {
            color: ${appConfig.theme.colors.neutrals['000']};
            font-size: 24px;
            font-wigth: 600;
        }
        `}</style>
    </>
    );
}
//Componente React
function HomePage(){
    //JSX
    return(
        <div style={{backgroundColor: 'black'}}>
            <GlobalStyle/>
            <Title tag="h2">Boas vindas de volta!</Title>
            <h2>Discord - Alura Matrix</h2>
        </div>
    )
}

export default HomePage