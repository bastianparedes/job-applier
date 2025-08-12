// Este código se ejecuta automáticamente al cargar la página en la terminal de la página

function executeDynamicCode(code: string) {
  eval(code);
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

var typeInput = async (selector: string, text: string) => {
  const input = document.querySelector(selector) as HTMLInputElement;
  input.focus();
  input.value = '';

  input.value += text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 100));

  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

var selectOption = async (selector: string, value: string) => {
  const select = document.querySelector(selector) as HTMLSelectElement;
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

var selectCv = async (cvName: string) => {
  const elements: any = [...document.querySelectorAll('.jobs-document-upload-redesign-card__file-name') as any];
  const element = elements.find((element) => element.innerText.includes(cvName));
  element?.click();
}

let isActive = true;
const selectors = {
  job: 'li[data-occludable-job-id]',
  jobBox: '.job-card-container',
  applyButton: '#jobs-apply-button-id',
  nextStep: '[aria-label="Ir al siguiente paso"]',
  cvName: '.jobs-document-upload-redesign-card__file-name',
  jobDetails: '#job-details',
  reviewButton: '[aria-label="Revisar tu solicitud"]',
  modal: '.jobs-easy-apply-modal',
  label: '.jobs-easy-apply-modal form label',
  input: '.jobs-easy-apply-modal form label + input',
};

const runScript = async () => {
  const jobs = document.querySelectorAll(selectors.job);
  for (let job of jobs) {
    if (!isActive) break;

    job.scrollIntoView({ behavior: 'smooth' });
    await sleep(Math.random() * 2000);

    const jobBox = job.querySelector(selectors.jobBox) as HTMLDivElement;
    jobBox.click();
    await sleep(500);

    const applyButton = document.querySelector(selectors.applyButton) as HTMLButtonElement | undefined;
    if (!applyButton) continue;
    applyButton.click();
    await sleep(500);


    const jobDetails = (document.querySelector(selectors.jobDetails) as HTMLDivElement).innerText;
    const languaje = await fetch('http://localhost:3000/ai/languaje', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: jobDetails,
      }),
    }).then(r => r.json()).then(json => json.data);
    const cvName = {
      english: 'resume.pdf',
      spanish: 'cv.pdf',
    }[languaje];

    while (true) {
      const modalContent = document.querySelector(selectors.modal).outerHTML;
      const scripts = await fetch('http://localhost:3000/ai/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `
Estoy aplicando a un trabajo, a continuación te paso el html que deberás manipular.
Quiero que me entregues un array de strings que contienen código javascript que luego ejecutaré para seguir con el proceso.
De ser necesario agrega un script para apretar los bonotes de "Siguiente" o "Revisar" o cerrar el modal.

Para input text usa la función typeInput(selector, text)
Para input select usa la función selectOption(selector, value)
Para seleccionar el curriculum a usar usa la función selectCv("${cvName}")


${modalContent}



Mi nombre: Bastián Gabriel Paredes Padget.
Chileno. Vivo en Puerto Montt.
993426163
bastian.p@outlook.com
30 años de edad
Pretensión de sueldo en pesos chilenos: 2800000
Pretensión de sueldo en dólares: 3000

Años de experiencia:
- 8 javascript
- 7 typescript
- 6 html, css, react, next
- 3 angular
- 1 google cloud
- 4 fastify, nest, express
- 1 react-native
- 2 docker
- 2 kubernetes
- 6 python
- 1 java
`
        }),
      }).then(r => r.json()).then(json => json.data.response);

      
      for (let script of scripts) {
        console.log('executing script', script);
        executeDynamicCode(script);
        await sleep(5000);
      };

      await sleep(500);
      if (!document.querySelector(selectors.modal)) break;
    }

  }
  isActive = false;
  alert("Postulaciones terminadas");
};

runScript();
