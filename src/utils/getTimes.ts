export const getCurrentTime = (): string => {
  const now = new Date();
  const date: number = now.getDate();
  const times: number = now.getTime();
  const result: string = (date + times).toString();
  return result;
};
