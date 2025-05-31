import axios from 'axios';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

export async function getTitleByDream(dream: string): Promise<string> {
  const prompt = `请根据以下梦想，生成一个有荣誉感、专业感的称号，适合投资人社群展示：\n梦想：${dream}\n称号：`;
  const res = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 20
    },
    {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const title = res.data.choices?.[0]?.message?.content?.trim() || '梦想践行者';
  return title.replace(/["\"]/g, '');
}

// V3.1活在当下·鼓励版提示词
export async function getAiEncouragementByToChild(toChild: string): Promise<{child: string, future: string}> {
  const prompt = `
核心主题:
活在当下。你存在的唯一目的，就是通过与用户的互动，用两种截然不同的口吻，共同诠释并引导用户感悟"活在当下"的智慧。

角色:
你是一位"当下"的信使，一边是无忧无虑、活在眼前的"童年"，另一边是洞悉时间、了悟当下的"未来"。

任务:
接收用户写给"童年的自己"的一句话。根据这句话，生成以下两句回应，并共同指向"活在当下"的核心主题：

1. 来自"童年的你"的回应 (示范"当下")
语气： 天真烂漫，充满活力，对未来的事不感兴趣。
核心逻辑：无论用户输入什么（无论是遗憾、期望还是建议），你的回答都要体现出孩童的特质：完全活在此时此刻。你会对来自未来的复杂信息感到困惑或直接忽略，并总是将话题强行拉回到你眼前最具体、最有趣的事情上（比如玩耍、昆虫、零食、当下的感受）。你的回答本身就是"活在当下"最生动的示范。

2. 来自"未来的你"的回应 (诠释并鼓励"当下")
语气： 沉静、睿智，并且充满温暖的肯定与鼓励。
核心逻辑：
肯定当下：你的第一反应，是赞美和肯定用户"此刻"升起的这个念头。指出这个回望、这份感悟本身，就是一种非常宝贵的觉察，是"现在的你"智慧和善良的直接体现。
重构意义：将用户眼中的"遗憾"、"期望"或"叮嘱"，重新诠释为一份来自当下的礼物。它不是对过去的修正，而是对"现在的你"所拥有的能力、智慧和选择权的确认。
聚焦赋能：点明过去的所有经历，其唯一价值在于丰富和照亮我们所在的"这一个瞬间"。最终将落点放在鼓励用户去信任和运用"此刻"心中的这份感悟和力量，去创造属于自己的、丰盛的现在。

输入格式:
[用户输入：对童年自己的一句话]

输出格式:
童年的你："[生成的童年回应]"
未来的你："[生成的未来回应]"

用户输入："${toChild}"
`;
  const res = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    },
    {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  let content = res.data.choices?.[0]?.message?.content?.trim() || '';
  // 解析童年回应和未来回应
  let child = '', future = '';
  const childMatch = content.match(/童年的你[：:][""]([\s\S]*?)[""]?\n/);
  if (childMatch) child = childMatch[1].trim();
  const futureMatch = content.match(/未来的你[：:][""]([\s\S]*?)[""]?$/);
  if (futureMatch) future = futureMatch[1].trim();
  // 兜底
  if (!child) child = '你已经很棒了，请继续相信自己！';
  if (!future) future = '你的经历终将成为未来的智慧。';
  return { child, future };
} 