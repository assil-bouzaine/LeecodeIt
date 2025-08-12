import * as cheerio from 'cheerio';
import chalk from 'chalk';
import { highlight } from 'cli-highlight';

export function renderProblemDescription(html) {
  const $ = cheerio.load(html);

  let output = '';

  function parseNode(i, elem, indent = 0) {
    const pad = ' '.repeat(indent);

    if (elem.type === 'text') {
      output += (elem.data || '').replace(/\s+/g, ' ');
      return;
    }

    switch (elem.tagName) {
      case 'p':
        output += pad + $(elem).text().trim() + '\n\n';
        break;

      case 'ul':
        $(elem).children('li').each((i, li) => {
          output += pad + chalk.green('• ') + $(li).text().trim() + '\n';
        });
        output += '\n';
        break;

      case 'pre':
        // get code text inside pre, highlight it
        const codeText = $(elem).text();
        const highlighted = highlight(codeText, {
          language: 'javascript', // or 'plaintext' if unsure
          ignoreIllegals: true,
          theme: { keyword: chalk.cyan, built_in: chalk.magenta },
        });
        output += '\n' + highlighted + '\n\n';
        break;

      case 'strong':
        output += chalk.bold($(elem).text());
        break;

      case 'em':
        output += chalk.italic($(elem).text());
        break;

      case 'li':
        output += pad + chalk.green('• ') + $(elem).text().trim() + '\n';
        break;

      default:
        // Recursively parse children for any other tags
        $(elem).contents().each((i, child) => parseNode(i, child, indent));
    }
  }

  $('body').contents().each(parseNode);

  return output;
}

