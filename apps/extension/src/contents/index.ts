// Este código se ejecuta automáticamente al cargar la página en la terminal de la página

function executeDynamicCode(code: string) {
  const script = document.createElement("script");
  script.textContent = code;
  script.type = "text/javascript";
  document.documentElement.appendChild(script);
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let isActive = false;
const selectors = {
  job: 'li[data-occludable-job-id]',
  jobBox: '.job-card-container',
  aplyButton: '#jobs-apply-button-id',
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
  for (let job of [jobs[0]]) {
    if (!isActive) break;

    job.scrollIntoView({ behavior: 'smooth' });
    await sleep(Math.random() * 2000 + 2000);

    const jobBox = job.querySelector(selectors.jobBox) as HTMLDivElement;
    jobBox.click();
    await sleep(2000);

    (document.querySelector(selectors.aplyButton) as HTMLButtonElement).click();
    await sleep(1000);


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
          prompt: `Estoy aplicando a un trabajo, a continuación te paso el html que deberás manipular. Quiero que me entregues un array de strings que contienen código javascript que luego ejecutaré para seguir con el proceso. También ten encuenta que si debes seleccionar un curriculum, este se llama ${cvName}.\n\n\n\n${modalContent}`,
        }),
      }).then(r => r.json()).then(json => json.data.response);

      for (let script of scripts) {
        executeDynamicCode(script);
        await sleep(500);
      };

      break;
      await sleep(1000);
      if (!document.querySelector(selectors.modal)) break;
    }

  }
  isActive = false;
  alert("Postulaciones terminadas");
};

chrome.runtime.onMessage.addListener((message) => {  
  if (message.action === "init") {
    isActive = true;
    runScript();
  }

  if (message.action === "stop") {
    isActive = false;
  }
});
