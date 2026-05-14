// ============================================================
// FIO SOB MEDIDA — Chatbot MARIANA
// State Machine & Conversation Controller
// ============================================================

import { HAIR_TYPES, CONDITIONS, OBJECTIVES, TIME_OPTIONS, SCHEDULE_TEMPLATES, Storage } from './data.js';

const STATES = {
  IDLE: 'idle',
  GREETING: 'greeting',
  HAIR_TYPE: 'hair_type',
  CONDITION: 'condition',
  OBJECTIVE: 'objective',
  TIME: 'time',
  NAME: 'name',
  PROCESSING: 'processing',
  DIAGNOSIS: 'diagnosis',
  CHAT: 'chat',
};

const MARIANA_RESPONSES = {
  greeting: [
    'Olá, linda! Que alegria te ter aqui! ✨ Sou a Mariana, sua consultora de tricologia pessoal.',
    'Vamos criar juntas o cronograma capilar perfeito para os seus fios?',
    'Antes de começar, preciso te conhecer melhor — farei algumas perguntas rápidas sobre o seu cabelo.',
  ],
  hairType: 'Primeiro, me diga: **qual é o seu tipo de cabelo?** Escolha a opção que melhor descreve a textura natural dos seus fios, meu bem.',
  condition: 'Que ótimo! Agora me conta, linda — **como está a condição atual do seu cabelo?** Seja honesta comigo, tudo bem? Estou aqui para ajudar, não julgar! 💕',
  objective: 'Entendi perfeitamente! Agora vem a parte mais importante: **qual é o seu principal objetivo capilar?** O que seus fios mais precisam agora, princesa?',
  time: 'Maravilha! Para montar o seu cronograma ideal, preciso saber: **quantos dias por semana você consegue dedicar ao cuidado capilar?** Seja realista — rotina que funciona é melhor que rotina perfeita! 🌸',
  name: 'Quase lá! Antes de criar o seu diagnóstico personalizado, me diz: **qual é o seu nome?** Gosto de chamar minhas clientes pelo nome, princesa! 😊',
  processing: [
    'Um momento, {name}... estou analisando tudo que você me contou! 🔬',
    'Cruzando os dados do seu perfil capilar...',
    'Preparando seu diagnóstico exclusivo... ✨',
  ],
  diagnosisIntro: 'Prontinho, {name}! Aqui está o seu **Diagnóstico Capilar Personalizado**:',
  chatWelcome: 'Estou à disposição para qualquer dúvida sobre cuidados capilares, {name}! O que mais posso fazer por você? 💕',
  outOfScope: 'Que pergunta interessante, {name}! Mas minha especialidade é toda voltada ao universo capilar. 😊 Posso te ajudar com dúvidas sobre o seu cronograma, produtos recomendados ou técnicas de hidratação. O que prefere?',
  chatResponses: {
    porosity: 'A porosidade capilar é a capacidade do fio de absorver e reter umidade, {name}. Fios de alta porosidade absorvem rápido mas perdem fácil — ideal trabalhar com técnicas de selagem após a hidratação. Deseja saber como testar a sua?',
    cronograma: 'O cronograma capilar é a distribuição estratégica de tratamentos ao longo da semana, organizando hidratação, nutrição e reconstrução de forma sequencial. O seu está montado na seção de cronograma! 📅',
    queda: 'A queda capilar tem diversas causas: estresse, deficiências nutricionais, desequilíbrios hormonais e até excesso de procedimentos químicos. Para um diagnóstico preciso da queda, recomendo consultar um dermatologista ou tricologista presencialmente, linda. Mas posso te indicar produtos tópicos que auxiliam no fortalecimento!',
    coloracao: 'A coloração e os procedimentos químicos são os maiores vilões da saúde capilar quando feitos sem o preparo adequado. Sempre faça a reconstrução antes e depois de qualquer química, princesa! O seu cronograma já considera esse cuidado.',
    calor: 'O calor acima de 180°C causa danos irreversíveis à queratina natural dos fios, {name}. Sempre use protetor térmico e mantenha a temperatura controlada. Quanto mais natural, melhor para a saúde capilar!',
  },
};

const HAIR_CARE_KEYWORDS = [
  'cabelo', 'fio', 'hidra', 'nutri', 'reconstru', 'mask', 'shampoo', 'condicion',
  'leave-in', 'óleo', 'queratina', 'porosi', 'cronograma', 'queda', 'crescimento',
  'oleoso', 'seco', 'cacheado', 'crespo', 'liso', 'ondulado', 'escova', 'química',
  'tintura', 'cor', 'calor', 'chapinha', 'secador', 'finalizador', 'couro cabeludo',
  'lavagem', 'penteado', 'cachos', 'frizz', 'brilho', 'maciez', 'elasticidade',
  'produto', 'marca', 'tratamento', 'protocolo', 'etapa', 'rotina', 'cuidado',
  'beauty', 'beleza', 'cosmetico', 'cosmético', 'serum', 'sérum', 'ampola', 'vitamina',
];

class MarianaBot {
  constructor(onUpdate) {
    this.state = STATES.IDLE;
    this.profile = {};
    this.messages = [];
    this.onUpdate = onUpdate; // callback to re-render
    this.typingDelay = 800;
    this.diagnosisGenerated = false;
  }

  start() {
    this.state = STATES.GREETING;
    this.messages = [];
    this._sendSequential(MARIANA_RESPONSES.greeting, () => {
      this._sendMessage('mariana', MARIANA_RESPONSES.hairType);
      this.state = STATES.HAIR_TYPE;
      this._showOptions('hairType');
    });
  }

  handleInput(input) {
    if (typeof input === 'object' && input.value) {
      this._handleOption(input);
    } else if (typeof input === 'string') {
      this._handleText(input);
    }
  }

  _handleOption({ value, label, stateKey }) {
    this._sendMessage('user', label);
    this.profile[stateKey] = value;

    switch (this.state) {
      case STATES.HAIR_TYPE:
        this.state = STATES.CONDITION;
        this._typing(() => {
          this._sendMessage('mariana', MARIANA_RESPONSES.condition);
          this._showOptions('condition');
        });
        break;
      case STATES.CONDITION:
        this.state = STATES.OBJECTIVE;
        this._typing(() => {
          this._sendMessage('mariana', MARIANA_RESPONSES.objective);
          this._showOptions('objective');
        });
        break;
      case STATES.OBJECTIVE:
        this.state = STATES.TIME;
        this._typing(() => {
          this._sendMessage('mariana', MARIANA_RESPONSES.time);
          this._showOptions('time');
        });
        break;
      case STATES.TIME:
        this.state = STATES.NAME;
        this._typing(() => {
          this._sendMessage('mariana', MARIANA_RESPONSES.name);
          this._showTextInput();
        });
        break;
    }
  }

  _handleText(text) {
    this._sendMessage('user', text);

    if (this.state === STATES.NAME) {
      const name = text.trim().split(' ')[0];
      this.profile.userName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      this._runDiagnosis();
      return;
    }

    if (this.state === STATES.CHAT) {
      this._handleChatMessage(text);
      return;
    }
  }

  _handleChatMessage(text) {
    const lower = text.toLowerCase();

    const isHairRelated = HAIR_CARE_KEYWORDS.some(kw => lower.includes(kw));
    if (!isHairRelated) {
      this._typing(() => {
        const msg = MARIANA_RESPONSES.outOfScope.replace('{name}', this.profile.userName || 'linda');
        this._sendMessage('mariana', msg);
      });
      return;
    }

    let response = null;
    if (lower.includes('porosi')) response = MARIANA_RESPONSES.chatResponses.porosity;
    else if (lower.includes('cronograma')) response = MARIANA_RESPONSES.chatResponses.cronograma;
    else if (lower.includes('queda')) response = MARIANA_RESPONSES.chatResponses.queda;
    else if (lower.includes('tint') || lower.includes('cor') || lower.includes('química') || lower.includes('quimica')) response = MARIANA_RESPONSES.chatResponses.coloracao;
    else if (lower.includes('calor') || lower.includes('chapinha') || lower.includes('prancha') || lower.includes('secador')) response = MARIANA_RESPONSES.chatResponses.calor;
    else {
      response = `Ótima questão, ${this.profile.userName || 'linda'}! Com base no seu perfil (cabelo ${HAIR_TYPES[this.profile.hairType]?.label?.toLowerCase() || ''}, ${CONDITIONS[this.profile.condition]?.label?.toLowerCase() || ''}), recomendo focar na consistência do seu cronograma personalizado. Cada produto que indico no marketplace foi selecionado especialmente para as suas necessidades. Tem mais alguma dúvida? 💕`;
    }

    this._typing(() => {
      const msg = response.replace('{name}', this.profile.userName || 'linda');
      this._sendMessage('mariana', msg);
    });
  }

  _runDiagnosis() {
    this.state = STATES.PROCESSING;
    const name = this.profile.userName;

    const processingMsgs = MARIANA_RESPONSES.processing.map(m => m.replace('{name}', name));

    this._sendSequential(processingMsgs, () => {
      this._generateDiagnosis();
    }, 900);
  }

  _generateDiagnosis() {
    const { hairType, condition, objective, time, userName } = this.profile;
    const timeDays = TIME_OPTIONS[time]?.days || 3;

    const schedule = SCHEDULE_TEMPLATES.getTemplate({
      hairType, condition, objective, timeDays, userName,
    });

    this.profile.schedule = schedule;
    Storage.save('profile', this.profile);
    Storage.save('schedule', schedule);

    this.state = STATES.DIAGNOSIS;
    this.diagnosisGenerated = true;

    const intro = MARIANA_RESPONSES.diagnosisIntro.replace('{name}', userName);
    this._sendMessage('mariana', intro);

    setTimeout(() => {
      this._sendDiagnosisCard(schedule);

      setTimeout(() => {
        const welcome = MARIANA_RESPONSES.chatWelcome.replace('{name}', userName);
        this._sendMessage('mariana', welcome);
        this.state = STATES.CHAT;
        this._showTextInput();

        if (this.onUpdate) this.onUpdate('diagnosis_complete', this.profile);
      }, 600);
    }, 400);
  }

  _sendDiagnosisCard(schedule) {
    const hairLabel = HAIR_TYPES[this.profile.hairType]?.label || '';
    const condLabel = CONDITIONS[this.profile.condition]?.label || '';
    const objLabel = OBJECTIVES[this.profile.objective]?.label || '';
    const timeLabel = TIME_OPTIONS[this.profile.time]?.label || '';

    const card = {
      type: 'diagnosis_card',
      data: { hairLabel, condLabel, objLabel, timeLabel, schedule },
    };
    this._sendMessage('mariana', card);
  }

  _sendSequential(messages, onDone, delay = 700) {
    let i = 0;
    const send = () => {
      if (i < messages.length) {
        this._sendMessage('mariana', messages[i++]);
        setTimeout(send, delay);
      } else if (onDone) {
        setTimeout(onDone, 300);
      }
    };
    send();
  }

  _sendMessage(sender, content) {
    const msg = {
      id: Date.now() + Math.random(),
      sender,
      content,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    this.messages.push(msg);
    if (this.onUpdate) this.onUpdate('message', msg);
  }

  _showOptions(step) {
    if (this.onUpdate) this.onUpdate('show_options', { step, state: this.state });
  }

  _showTextInput() {
    if (this.onUpdate) this.onUpdate('show_text_input', {});
  }

  _typing(callback) {
    if (this.onUpdate) this.onUpdate('typing', true);
    setTimeout(() => {
      if (this.onUpdate) this.onUpdate('typing', false);
      callback();
    }, this.typingDelay);
  }

  getProfile() {
    return this.profile;
  }

  isComplete() {
    return this.diagnosisGenerated;
  }

  reset() {
    this.state = STATES.IDLE;
    this.profile = {};
    this.messages = [];
    this.diagnosisGenerated = false;
    Storage.clear('profile');
    Storage.clear('schedule');
  }
}

export { MarianaBot, STATES };
