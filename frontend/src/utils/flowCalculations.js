// Calculate when emails will be sent based on Wait nodes
export const calculateScheduledEmails = (flow) => {
    const scheduledEmails = [];
    const now = new Date();
    
    // Find all email nodes
    const emailNodes = flow.nodes.filter(node => node.type === 'coldEmail');
    
    emailNodes.forEach(emailNode => {
      let totalDelay = 0;
      
      // Find connected wait nodes that come before this email
      const incomingEdges = flow.edges.filter(edge => edge.target === emailNode.id);
      incomingEdges.forEach(edge => {
        const sourceNode = flow.nodes.find(n => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'wait') {
          const delay = parseInt(sourceNode.data.delay || 0);
          const timeUnit = sourceNode.data.timeUnit || 'days';
          
          // Convert to milliseconds
          let delayMs = delay;
          if (timeUnit === 'minutes') delayMs *= 60 * 1000;
          else if (timeUnit === 'hours') delayMs *= 60 * 60 * 1000;
          else if (timeUnit === 'days') delayMs *= 24 * 60 * 60 * 1000;
          
          totalDelay += delayMs;
        }
      });
      
      // Calculate scheduled time
      const scheduledTime = new Date(now.getTime() + totalDelay);
      
      scheduledEmails.push({
        id: emailNode.id,
        subject: emailNode.data.subject || '(No subject)',
        content: emailNode.data.content || '(No content)',
        scheduledTime: scheduledTime.toISOString(),
        formattedTime: scheduledTime.toLocaleString()
      });
    });
    
    return scheduledEmails;
  };