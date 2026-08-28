const PAD2 = (n: number) => String(n).padStart(2, "0");

/**
 * Мини-форматтер штампа даты: токены YYYY MM DD hh mm ss заменяются
 * значениями локального времени, остальные символы остаются как есть.
 */
export function formatStamp(date: Date, pattern: string): string {
	return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, (token) => {
		switch (token) {
			case "YYYY":
				return String(date.getFullYear());
			case "MM":
				return PAD2(date.getMonth() + 1);
			case "DD":
				return PAD2(date.getDate());
			case "hh":
				return PAD2(date.getHours());
			case "mm":
				return PAD2(date.getMinutes());
			case "ss":
				return PAD2(date.getSeconds());
			default:
				return token;
		}
	});
}
