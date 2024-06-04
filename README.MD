# README - Fullstack Challenge - Term-Tracker-API

- **1. Descrição do Projeto**

  O Fullstack Challenge - Dictionary é uma API Restful construída com as melhores práticas de desenvolvimento, utilizando as tecnologias NestJS, Class Validator, MongoDB, Mongoose, Redis e JWT. A API oferece funcionalidades para gerenciamento de usuários, autenticação, consulta de palavras em um dicionário, favoritos e histórico de acessos.

- **2. Tecnologias Utilizadas**

  `Linguagem:` TypeScript

  `Framework:` NestJS

  `Validação:` Class Validator

  `Banco de Dados:` MongoDB

  `ORM:` Mongoose

  `Cache:` Redis

  `Autenticação:` JWT

  `Documentação:` Open API 3.0

- **3. Instalação e Uso**

  - **3.1 Pré-requisitos**

    Node.js 16 ou superior
    npm ou yarn instalado globalmente
    Docker instalado

  - **3.2 Clonando o Repositório**

    ```console
    git clone https://github.com/<seu-usuario>/fullstack-challenge-dictionary.git
    cd fullstack-challenge-dictionary
    ```

  - **3.3 Instalação das Dependências**

    ```console
    npm install || yarn install
    ```

  - **3.4 Configuração do Docker**

    O projeto utiliza Docker para facilitar o deploy e a execução em diferentes ambientes. Para iniciar o ambiente de desenvolvimento, execute o seguinte comando:

    ```console
    docker-compose up -d
    ```

  - **3.5 Acessando a API**

    A API estará disponível por padrão na seguinte URL:

    http://localhost:3000

  - **3.6 Documentação da API**

    A documentação da API está disponível em formato Open API 3.0 na seguinte URL:

    http://localhost:3000/docs

- **4. Roteiros da API**

  - **4.1 Autenticação**

    - **[POST] /auth/signup**
      _ **Descrição:** Cadastra um novo usuário.
      _ **Requisição:**

      ```json
      {
        "name": "User 1",
        "email": "example@email.com",
        "password": "test"
      }
      ```

      \_ **Resposta:**

      ```json
      {
        "id": "f3a10cec013ab2c1380acef",
        "name": "User 1",
        "token": "Bearer JWT.Token"
      }
      ```

    - **[POST] /auth/signin**
      _ \*\*Descrição: Autentica um usuário existente.
      _ **Requisição:**

    ```json
    {
      "email": "example@email.com",
      "password": "test"
    }
    ```

    \_ **Resposta:**

    ```json
    {
      "id": "f3a10cec013ab2c1380acef",
      "name": "User 1",
      "token": "Bearer JWT.Token"
    }
    ```

  - **4.2 Dicionário**

    - **[GET] /entries/en**
      _ \*\*Descrição: Lista as palavras do dicionário, com paginação e suporte a busca.
      _ **Parâmetros:**
      _ search: Termo de busca (opcional).
      _ limit: Quantidade de resultados por página (opcional, padrão 10).
      _ page: Página a ser exibida (opcional, padrão 1).
      _ **Resposta:**

      ```json
      {
        "results": ["fire", "firefly", "fireplace", "fireman"],
        "totalDocs": 20,
        "page": 1,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
      ```

    - **[GET] /entries/en/:word**
      _ \*\*Descrição: Retorna as informações da palavra especificada e registra o histórico de acesso.
      _ **Parâmetros:**
      _ word: Palavra a ser consultada.
      _ **Resposta:**

      ```json
      {
        "word": "fire",
        "definition": "A burning of something, especially wood or other fuel, that produces flames and heat.",
        "examples": [
          "The fire spread quickly through the forest.",
          "He built a fire to keep warm.",
          "The firefighters battled the blaze for hours."
        ],
        "userId": "f3a10cec013ab2c1380acef",
        "added": "2024-06-04T13:31:00.000Z"
      }
      ```

    - **[POST] /entries/en/:word/favorite**

      - **Descrição:** Salva a palavra na lista de favoritas do usuário.
      - **Requisição:**
        - Deve ser enviada com o token de autenticação no header.
      - **Resposta:**
        - Sucesso (código 204)

    - **[DELETE] /entries/en/:word/unfavorite**
    - **Descrição:** Remove a palavra da lista de favoritas do usuário.
    - **Requisição:**
      - Deve ser enviada com o token de autenticação no header.
    - **Resposta:**
      - Sucesso (código 204)

  - **4.3 Usuário**

  - **[GET] /user/me**

    - **Descrição:** Retorna o perfil do usuário autenticado.
    - **Requisição:**
      - Deve ser enviada com o token de autenticação no header.
    - **Resposta:**
      ```json
      {
        "id": "f3a10cec013ab2c1380acef",
        "name": "User 1",
        "email": "example@email.com"
      }
      ```

  - **[GET] /user/me/history**

    - **Descrição:** Lista o histórico de palavras acessadas pelo usuário.
    - **Parâmetros:**
      - `limit`: Quantidade de resultados por página (opcional, padrão 10).
      - `page`: Página a ser exibida (opcional, padrão 1).
    - **Resposta:**
      ```json
      {
        "results": [
          {
            "word": "fire",
            "added": "2024-06-04T13:31:00.000Z"
          },
          {
            "word": "your_searched_word",
            "added": "2024-06-04T13:31:00.000Z"
          }
        ],
        "totalDocs": 2,
        "page": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
      }
      ```

  - **[GET] /user/me/favorites**
  - **Descrição:** Lista as palavras favoritas do usuário autenticado.
  - **Parâmetros:**
    - `limit`: Quantidade de resultados por página (opcional, padrão 10).
    - `page`: Página a ser exibida (opcional, padrão 1).
  - **Resposta:**
    ```json
    {
      "results": [],
      "totalDocs": 0,
      "page": 1,
      "totalPages": 0,
      "hasNext": false,
      "hasPrev": false
    }
    ```

- **5. Cache**
  A API utiliza Redis para cachear o resultado de algumas requisições, como a listagem de palavras do dicionário. As respostas da API conterão os seguintes headers para informar a utilização do cache:

  - `x-cache`: Indica se a resposta foi obtida do cache (`HIT`) ou do banco de dados (`MISS`).
  - `x-response-time`: Tempo de duração da requisição em milissegundos.

- **6. Diferencial 1 - Documentação Open API 3.0**

  A documentação da API está disponível em formato Open API 3.0 e pode ser acessada em:

  http://localhost:3000/docs

- **7. Diferencial 3 - Configuração Docker**

  O projeto utiliza Docker para facilitar o deploy da API. Para mais informações sobre a configuração do Docker, consulte o arquivo `docker-compose.yml`.

- **8. .gitignore**

  O projeto utiliza o arquivo `.gitignore` para ignorar arquivos e pastas desnecessários no versionamento do código.

- **9. Projeto Pessoal no Github**

  Este projeto foi desenvolvido como um desafio proposto pela plataforma Coders. Caso esteja utilizando um repositório pessoal no Github, lembre-se de mencionar o desafio na descrição do projeto.

- **10. Licença**

  Este projeto ainda não possui uma licença definida. É recomendável escolher uma licença aberta e adequada para o seu projeto antes de publicá-lo em um repositório público.

- **11. Considerações Finais**

  O Fullstack Challenge - Dictionary é um projeto completo e robusto que demonstra habilidades em diversas áreas do desenvolvimento web. A API oferece funcionalidades avançadas para gerenciamento de usuários, autenticação, consulta de palavras em um dicionário, favoritos e histórico de acessos, além de utilizar as melhores práticas de desenvolvimento e tecnologias modernas.

- **12. Próximos Passos**

  O projeto pode ser aprimorado de diversas maneiras, como:

  Implementar endpoints para adicionar e remover palavras do dicionário.
  Integrar com APIs externas, como APIs de tradução ou de definições de palavras.
  Implementar recursos de gamificação para incentivar o aprendizado de idiomas.
  Criar uma interface web para facilitar o uso da API. 13. Agradecimentos

  Agradeço a Coders por ter me proposto este desafio e por me proporcionar a oportunidade de desenvolver este projeto.

- **14. Contribuições**

  Este projeto é de código aberto e qualquer pessoa pode contribuir com sugestões, correções de bugs ou novas funcionalidades. Para contribuir, basta criar um pull request no repositório Github.

- **15. Contato**

  Para dúvidas, sugestões ou contribuições, entre em contato comigo pelo e-mail [[endereço de email removido]].
