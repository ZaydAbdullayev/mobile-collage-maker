const url_prefix = "https://ibronevik.ru/taxi/c/gruzvill/api/v1/";
const u_token = "ff75d97755b27bb0d058ecb2c1ed589f";
const u_hash =
  "JxgBVHP0rSRyN8Jt653GLQ2iH98IMAlEC3NtiCxkT42f9PqJFT448gQfn9FvSVxM8D7lRNDog/Gxtew97iHdJgFmBIo7wfZHjROujBQ1uPJfzWIdhlVwtiZdTSmPazPR";

async function postRequest(api, data = {}, rawResponse = false) {
  data = Object.assign({ token: u_token, u_hash: u_hash }, data);

  let opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data).toString(),
  };
  const response = await fetch(`${url_prefix}${api}`, opt);
  if (!response.ok) throw new Error("Request failed.");
  if (rawResponse) {
    return response;
  } else {
    if (!response.headers.get("Content-Type").startsWith("application/json"))
      throw new Error("Invalid content type.");
    return response.json().then((ret) => {
      if (ret.status !== "success")
        throw new Error('Response status is not "success".');
      return ret.data;
    });
  }
}

export async function getCollages() {
  const result = await postRequest("drive", { fields: 0 });
  return Object.keys(result.booking).map((id) => {
    let collageData = result.booking[id].b_options.collage[0];
    let collage = {
      boxSize: {
        h: collageData.canvasHeight,
        w: collageData.canvasWidth,
        bg: "#353535",
      },
      filter: collageData.globalFilters,
      composedId: collageData.composedId, // need to append this line
      collage: collageData.images.map((im) => ({
        id: im.dlId,
        filename: im.filename,
        h: im.height,
        w: im.width,
        x: im.left,
        y: im.top,
        z: im.layer,
        filter: im.filters,
        media: im.media,
        size: im.size,
      })),
    };

    return {
      id,
      title: result.booking[id].b_custom_comment,
      collage,
    };
  });
}

export async function loadImage(dlId) {
  const response = await postRequest(`dropbox/file/${dlId}`, {}, true);
  return response.blob();
}

export async function loadCollage(collage) {
  // Ensure collage.collage is an array
  if (!Array.isArray(collage?.collage)) {
    return null;
  }

  let loads = [];
  for (let im of collage.collage) {
    if (!im.src) {
      loads.push(
        loadImage(im.id).then((result) => {
          im.image = result;
          im.src = window.URL.createObjectURL(result);
        })
      );
    }
  }
  await Promise.all(loads);
  return collage;
}
