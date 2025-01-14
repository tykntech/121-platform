export const DEBUG = true;

export const PORT = 3000;
export const SUBDOMAIN = process.env.NODE_ENV == 'production' ? '121-service/' : '';

const tyknIMS = 'http://11.0.0.3:50001/api/';
const orgIMS = 'http://11.0.0.4:50002/api/';
const userIMS = 'http://11.0.0.5:50003/api/';


export const API = {
  schema: tyknIMS + 'schema',
  credential: {
    definition: orgIMS + 'credential/definition',
    credoffer: orgIMS + 'credential/credoffer',
    issue: orgIMS + 'credential/issue',
  },
  proof: {
    verify: orgIMS + 'proof/verify',
  },
};
