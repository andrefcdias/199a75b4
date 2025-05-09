import { KeyboardEventHandler, useState } from "react";
import "./Exercise.css";

const key = "";
const endpoint = `http://api.giphy.com/v1/gifs/search?api_key=${key}`;

export const Exercise = () => {
  const [gifs, setGifs] = useState<string[]>([]);

  const searchGifs = async (searchTerm: string): Promise<string[] | null> => {
    const response = await fetch(`${endpoint}&q=${searchTerm}`, {});
    if (!response.ok) return null;

    const body = await response.json();

    return body.data.map((d: any) => d.images.fixed_height.url);
  };

  const debounce = (callback: (p: any) => void, time: number) => {
    let timeout: any | null = null;

    return (params: any) => {
      if (timeout !== null) window.clearTimeout(timeout);

      timeout = setTimeout(() => {
        callback(params);
      }, time);
    };
  };

  const search: KeyboardEventHandler<HTMLInputElement> = async (event) => {
    const value = (event.target as HTMLInputElement).value;

    const gifs = await searchGifs(value);
    if (gifs === null) return;

    setGifs(gifs);
  };

  return (
    <>
      <input type="text" name="search" onKeyUp={debounce(search, 500)} />
      <div className="gif-grid">
        {gifs.map((gif) => (
          <img src={gif} />
        ))}
      </div>
    </>
  );
};
