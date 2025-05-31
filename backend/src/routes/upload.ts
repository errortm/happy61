import { Router, Request, Response } from 'express';
import { getAiEncouragementByToChild } from '../utils/deepseekApi';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const toChild = req.body.toChild || '';
  let childReply = '', futureReply = '';
  try {
    const aiRes = await getAiEncouragementByToChild(toChild);
    childReply = aiRes.child;
    futureReply = aiRes.future;
  } catch (e) {
    childReply = '你已经很棒了，请继续相信自己！';
    futureReply = '你的经历终将成为未来的智慧。';
  }
  res.json({ toChild, childReply, futureReply });
});

export default router; 