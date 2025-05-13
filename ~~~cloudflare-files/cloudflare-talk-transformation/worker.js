import { ProcessReplaceChange, ProcessAttributeChange, ParamMapping } from "./functionality_classes.js";

export default {
  async fetch(request, env, ctx) {
    const urlObject = new URL(request.url);
    const params = new URLSearchParams(urlObject.search);
    const page = params.get('page');

    const response = await fetch(request);
    if (page === 'EMPTY') return response;

    const dataString = await env.KV.get(page);
    if (dataString === null) return processNotFoundRewrite(response);

    const data = JSON.parse(dataString);
    return processRewrite(response, data);
  },
};

export function processRewrite(response, data) {
  const rewriter = new HTMLRewriter();

  rewriter.on('.global-wrapper', new ProcessAttributeChange('class', 'global-wrapper'));

  rewriter.on('[data-matcher=image-path]', new ProcessAttributeChange('src', data.image));
  rewriter.on('div[data-matcher=image-path', new ProcessAttributeChange('class', 'image-placeholder hidden'));
  rewriter.on('img[data-matcher=image-path', new ProcessAttributeChange('class', 'image-element'));

  rewriter.on('[data-matcher=userid]', new ProcessReplaceChange(data.username));
  rewriter.on('[data-matcher=header-text]', new ProcessReplaceChange(data.banner));
  rewriter.on('[data-matcher=email]', new ProcessReplaceChange(data.email));
  rewriter.on('[data-matcher=city]', new ProcessReplaceChange(data.city));
  rewriter.on('[data-matcher=state]', new ProcessReplaceChange(data.state));
  rewriter.on('[data-matcher=zipcode]', new ProcessReplaceChange(data.zipcode));
  rewriter.on('[data-matcher=ip-address]', new ProcessReplaceChange(data.ip));

  return rewriter.transform(response);
}

export function processNotFoundRewrite(response) {
  const rewriter = new HTMLRewriter();
  rewriter.on('#issue', new ProcessAttributeChange('class', 'core-issue'));
  return rewriter.transform(response);
}
